/**
 * 图片压缩工具函数
 */

/**
 * 压缩图片并转换为base64
 * @param file 图片文件
 * @param maxWidth 最大宽度（默认800px）
 * @param quality 压缩质量（0-1，默认0.8）
 * @returns Promise<string> 返回base64字符串
 */
export const compressImage = (
  file: File,
  maxWidth: number = 800,
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // 计算压缩后的尺寸
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("无法创建画布上下文"));
          return;
        }

        // 绘制压缩后的图片
        ctx.drawImage(img, 0, 0, width, height);

        // 转换为base64
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };
      img.onerror = () => {
        reject(new Error("图片加载失败"));
      };
    };
    reader.onerror = () => {
      reject(new Error("文件读取失败"));
    };
  });
};

/**
 * 智能压缩图片（自动调整压缩参数以确保文件大小在限制内）
 * @param file 图片文件
 * @param maxSizeKB 最大文件大小（KB，默认500KB）
 * @param initialMaxWidth 初始最大宽度（默认800px）
 * @param initialQuality 初始质量（默认0.8）
 * @returns Promise<string> 返回base64字符串
 */
export const smartCompressImage = async (
  file: File,
  maxSizeKB: number = 500,
  initialMaxWidth: number = 800,
  initialQuality: number = 0.8
): Promise<string> => {
  // 第一次压缩
  let compressedBase64 = await compressImage(file, initialMaxWidth, initialQuality);
  const maxSize = maxSizeKB * 1024; // 转换为字节

  // 如果压缩后仍然太大，进一步压缩
  if (compressedBase64.length > maxSize) {
    compressedBase64 = await compressImage(file, 600, 0.7);
    
    // 如果还是太大，继续压缩
    if (compressedBase64.length > maxSize) {
      compressedBase64 = await compressImage(file, 400, 0.6);
    }
  }

  return compressedBase64;
};

