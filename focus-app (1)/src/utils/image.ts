// Focus App - Image Utility for Profile Avatar

/**
 * Processes an uploaded image file from the user's gallery or camera,
 * center-crops it into a clean square, resizes to high-DPI avatar dimensions (360x360),
 * and compresses it to an optimized JPEG data URL to fit comfortably in local storage.
 */
export async function processAvatarImage(file: File, targetSize = 360): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('O arquivo selecionado não é uma imagem válida.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Erro ao ler a foto da galeria.'));
    };

    reader.onload = () => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error('Não foi possível carregar a imagem.'));
      };

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Falha ao inicializar o processador de imagem.'));
            return;
          }

          // Center-crop calculation (square)
          const naturalWidth = img.naturalWidth || img.width;
          const naturalHeight = img.naturalHeight || img.height;

          let sourceX = 0;
          let sourceY = 0;
          let sourceSize = Math.min(naturalWidth, naturalHeight);

          if (naturalWidth > naturalHeight) {
            sourceX = (naturalWidth - naturalHeight) / 2;
            sourceY = 0;
          } else {
            sourceX = 0;
            sourceY = (naturalHeight - naturalWidth) / 2;
          }

          // Anti-aliasing quality settings
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw cropped & resized square image
          ctx.drawImage(
            img,
            sourceX,
            sourceY,
            sourceSize,
            sourceSize,
            0,
            0,
            targetSize,
            targetSize
          );

          // Export as optimized JPEG data URL (quality 0.88 gives ~30-50KB size)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
