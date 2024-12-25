/**
 * 压缩图片
 * @param {File} file 原始文件
 * @param {Number} maxSize 最大文件大小(MB)
 * @returns {Promise<File>} 压缩后的文件
 */
export const compressImage = (file, maxSize) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // 保持宽高比的情况下，如果宽度和高度超过4096，则等比缩小
        const maxDimension = 4096
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height)
          width *= ratio
          height *= ratio
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        // 从0.95开始尝试压缩
        let quality = 0.95
        let compressedFile

        const compress = () => {
          canvas.toBlob(
            (blob) => {
              compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              })

              // 如果压缩后仍然超过限制，继续压缩
              if (compressedFile.size / 1024 / 1024 > maxSize && quality > 0.2) {
                quality -= 0.05
                compress()
              } else {
                resolve(compressedFile)
              }
            },
            file.type,
            quality
          )
        }

        compress()
      }
      img.onerror = reject
    }
    reader.onerror = reject
  })
}
