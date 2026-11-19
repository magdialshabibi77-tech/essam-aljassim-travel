"use client";

/**
 * ضغط وتصغير الصور قبل رفعها إلى السيرفر
 * يقلل حجم الصورة من عدة ميغابايت إلى ~200 كيلوبايت
 * يتفادى حد الـ 4.5 ميغابايت المفروض في Vercel
 * ويسرّع عملية الرفع والتصفح بشكل كبير
 */
export async function compressImage(
  file: File,
  maxDimension = 1600,
  quality = 0.85,
): Promise<File> {
  // لا نضغط ملفات SVG أو GIF المتحركة للحفاظ على الجودة والحركة
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);

        ctx.drawImage(img, 0, 0, width, height);

        // تصدير بصيغة WebP أو JPEG
        const targetType = "image/jpeg";
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
            const compressed = new File([blob], `${baseName}.jpg`, {
              type: targetType,
              lastModified: Date.now(),
            });
            resolve(compressed);
          },
          targetType,
          quality,
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
