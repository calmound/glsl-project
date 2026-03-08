'use client';

import { useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface UseShaderValidationOptions {
  addToast: (message: string, type: ToastType, duration?: number) => void;
}

const DEFAULT_VERTEX_SHADER = `
  attribute vec4 position;
  varying vec2 vUv;
  
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = position;
  }
`;

function createFullscreenQuad(gl: WebGLRenderingContext, program: WebGLProgram) {
  const positionLocation = gl.getAttribLocation(program, 'position');
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  if (positionLocation >= 0) {
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  }
}

export function useShaderValidation({ addToast }: UseShaderValidationOptions) {
  const validateShaderWithWebGL = useCallback(
    (fragmentShaderCode: string): { isValid: boolean; errors: string[] } => {
      const errors: string[] = [];

      if (!fragmentShaderCode.trim()) {
        errors.push('error: empty shader source');
        return { isValid: false, errors };
      }

      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');

        if (!gl) {
          errors.push('error: WebGL not supported');
          return { isValid: false, errors };
        }

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        if (!fragmentShader) {
          errors.push('error: failed to create fragment shader');
          return { isValid: false, errors };
        }

        gl.shaderSource(fragmentShader, fragmentShaderCode);
        gl.compileShader(fragmentShader);

        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
          const errorInfo = gl.getShaderInfoLog(fragmentShader);
          if (errorInfo) {
            errorInfo
              .split('\n')
              .filter(line => line.trim())
              .forEach(line => {
                if (line.includes('ERROR')) {
                  errors.push(line.trim());
                }
              });
          }
          gl.deleteShader(fragmentShader);
          return { isValid: false, errors };
        }

        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        if (!vertexShader) {
          errors.push('error: failed to create vertex shader');
          gl.deleteShader(fragmentShader);
          return { isValid: false, errors };
        }

        gl.shaderSource(vertexShader, DEFAULT_VERTEX_SHADER);
        gl.compileShader(vertexShader);

        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
          errors.push('error: vertex shader compilation failed');
          gl.deleteShader(fragmentShader);
          gl.deleteShader(vertexShader);
          return { isValid: false, errors };
        }

        const program = gl.createProgram();
        if (!program) {
          errors.push('error: failed to create shader program');
          gl.deleteShader(fragmentShader);
          gl.deleteShader(vertexShader);
          return { isValid: false, errors };
        }

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          const linkError = gl.getProgramInfoLog(program);
          if (linkError) {
            errors.push(`link error: ${linkError}`);
          }
          gl.deleteProgram(program);
          gl.deleteShader(fragmentShader);
          gl.deleteShader(vertexShader);
          return { isValid: false, errors };
        }

        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);

        return { isValid: true, errors: [] };
      } catch (error) {
        errors.push(`error: ${error instanceof Error ? error.message : 'unknown error'}`);
        return { isValid: false, errors };
      }
    },
    []
  );

  const compareCanvasOutput = useCallback((userCode: string, correctCode: string): Promise<boolean> => {
    return new Promise(resolve => {
      try {
        const canvas1 = document.createElement('canvas');
        const canvas2 = document.createElement('canvas');
        canvas1.width = canvas2.width = 256;
        canvas1.height = canvas2.height = 256;

        const gl1 = canvas1.getContext('webgl', { preserveDrawingBuffer: true });
        const gl2 = canvas2.getContext('webgl', { preserveDrawingBuffer: true });

        if (!gl1 || !gl2) {
          resolve(false);
          return;
        }

        const renderShader = (gl: WebGLRenderingContext, fragmentCode: string): boolean => {
          try {
            const vertexShader = gl.createShader(gl.VERTEX_SHADER);
            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            const program = gl.createProgram();

            if (!vertexShader || !fragmentShader || !program) {
              return false;
            }

            gl.shaderSource(vertexShader, DEFAULT_VERTEX_SHADER);
            gl.compileShader(vertexShader);
            if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
              return false;
            }

            gl.shaderSource(fragmentShader, fragmentCode);
            gl.compileShader(fragmentShader);
            if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
              return false;
            }

            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
              return false;
            }

            gl.useProgram(program);
            createFullscreenQuad(gl, program);

            const timeLocation = gl.getUniformLocation(program, 'u_time');
            if (timeLocation) gl.uniform1f(timeLocation, 0.0);

            const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
            if (resolutionLocation) gl.uniform2f(resolutionLocation, 256, 256);

            gl.viewport(0, 0, 256, 256);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.finish();

            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);

            return true;
          } catch {
            return false;
          }
        };

        if (!renderShader(gl1, userCode) || !renderShader(gl2, correctCode)) {
          resolve(false);
          return;
        }

        setTimeout(() => {
          try {
            const pixels1 = new Uint8Array(256 * 256 * 4);
            const pixels2 = new Uint8Array(256 * 256 * 4);

            gl1.readPixels(0, 0, 256, 256, gl1.RGBA, gl1.UNSIGNED_BYTE, pixels1);
            gl2.readPixels(0, 0, 256, 256, gl2.RGBA, gl2.UNSIGNED_BYTE, pixels2);

            let diffCount = 0;
            const threshold = 10;
            const sampleStep = 4;
            let sampleCount = 0;

            for (let y = 0; y < 256; y += sampleStep) {
              for (let x = 0; x < 256; x += sampleStep) {
                const i = (y * 256 + x) * 4;
                sampleCount++;

                const colorDistance = Math.sqrt(
                  Math.pow(pixels1[i] - pixels2[i], 2) +
                    Math.pow(pixels1[i + 1] - pixels2[i + 1], 2) +
                    Math.pow(pixels1[i + 2] - pixels2[i + 2], 2)
                );

                if (colorDistance > threshold) {
                  diffCount++;
                }
              }
            }

            const similarity = 1 - diffCount / sampleCount;
            resolve(similarity > 0.9);
          } catch {
            resolve(false);
          }
        }, 200);
      } catch {
        resolve(false);
      }
    });
  }, []);

  const showValidationErrors = useCallback(
    (errors: string[]) => {
      errors.forEach((error, index) => {
        setTimeout(() => {
          addToast(error, 'error', 5000);
        }, index * 200);
      });
    },
    [addToast]
  );

  return {
    validateShaderWithWebGL,
    compareCanvasOutput,
    showValidationErrors,
  };
}
