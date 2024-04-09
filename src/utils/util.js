import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';

export function canvasToPdf(canvas){
    // 将canvas转换为base64编码的图片字符串
    var imgUrl = canvas.toDataURL('image/png');
    // 创建一个PDF文档，设置为横向布局，单位为点，页面大小为200x200点
    var pdf = new JsPDF('landscape', 'pt', [200, 200]);
    // 将base64编码的图片添加到PDF文档中
    pdf.addImage(imgUrl, 'PNG', 0, 0, 200, 200);
    // 保存PDF文档，自动触发下载
    pdf.save(`默认文件名.pdf`)
}

export function imageToPdf(newPdf, imgUrl){
  newPdf.addPage()
  // 将base64编码的图片添加到PDF文档中
  newPdf.addImage(imgUrl, 'PNG', 0, 0, 200, 200);
  // 保存PDF文档，自动触发下载
  newPdf.save(`默认文件名.pdf`)
}

/**
 * 将HTML元素转换为PDF文件并下载
 * 该函数没有参数和返回值，它会将指定的HTML元素（通过elementId标识）捕获并转换为PDF格式，
 * 然后触发下载该PDF文件。
 */
export function htmlToPdf(elementId, viewPort){
  // 使用html2canvas将HTML元素转换为canvas
  html2canvas(elementId).then((canvas) => {
    // 将canvas转换为base64编码的图片字符串
      var imgUrl = canvas.toDataURL('image/png');
    // 创建一个PDF文档，设置为横向布局，单位为点，页面大小为200x200点
    var pdf = new JsPDF('p', 'pt', [viewPort.width, viewPort.height]);
    // 将base64编码的图片添加到PDF文档中
    pdf.addImage(imgUrl, 'PNG', 0, 0, viewPort.width, viewPort.height);
    // 保存PDF文档，自动触发下载
    pdf.save(`默认文件名.pdf`)
  })
}
