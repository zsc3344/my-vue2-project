import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';
import { Message } from 'element-ui'

// 生成多页pdf
export function MultiHtmlToCanvas(pdfContainer, viewPort){
  // 使用html2canvas将HTML元素转换为canvas
  html2canvas(pdfContainer).then(canvas => {
    var contentWidth = canvas.width;
    var contentHeight = canvas.height;

    //一页pdf显示html页面生成的canvas高度;
    var pageHeight = (contentWidth / viewPort.width * viewPort.height) + 16;
    //未生成pdf的html页面高度
    var leftHeight = contentHeight;
    //页面偏移
    var position = 0;
    //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
    var imgWidth = viewPort.width;
    var imgHeight = viewPort.width/contentWidth * contentHeight;

    var pageData = canvas.toDataURL('image/png',1.0);

    var pdf = new JsPDF('p', 'pt', [viewPort.width, viewPort.height]);

    //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
    //当内容未超过pdf一页显示的范围，无需分页
    if (leftHeight < pageHeight) {
      pdf.addImage(pageData, 'PNG', 0, 0, imgWidth, imgHeight );
    } else {
      console.log('===leftHeight===', leftHeight)
      console.log('===pageHeight===', pageHeight)
      while(leftHeight > 0) {
        pdf.addImage(pageData, 'PNG', 0, position, imgWidth, imgHeight, null, 1)
        leftHeight -= pageHeight;
        position -= viewPort.height;
        //避免添加空白页
        console.log('===leftHeight===', leftHeight)
        if(leftHeight > 0) {
          pdf.addPage();
        }
      }
    }
    pdf.save('content.pdf');
  })
}

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
export function htmlToPdf(pdfContainer, viewPort){
  // 使用html2canvas将HTML元素转换为canvas
  html2canvas(pdfContainer).then((canvas) => {
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

// 模板列表弹框下载方法
export async function downloadFileForTemp(fileOrUrl, fileName, ext) {
  let file = null, extraName = ext

  if(typeof(fileOrUrl) === 'string') {
    const { ext, data } = await http.get(fileOrUrl, { responseType: 'blob' })
    file = data
    !extraName && (extraName = ext)
  } else {
    file = fileOrUrl.data
    !extraName && (extraName = fileOrUrl.ext)
  }

  if(file.type.includes('json')) {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = () => {
      const res = JSON.parse(reader.result)
      Message.error(res.message)
    }
    return
  }


  if(navigator.msSaveOrOpenBlob) {
    return window.navigator.msSaveOrOpenBlob(file, `${fileName}`)
  }

  if ('download' in document.createElement('a')) {
    const downloadElement = document.createElement('a')
    let href = ''
    if (window.URL) href = window.URL.createObjectURL(file)
    else href = window.webkitURL.createObjectURL(file)
    downloadElement.href = href
    downloadElement.download = `${fileName}`
    document.body.appendChild(downloadElement)
    downloadElement.click()
    if (window.URL) window.URL.revokeObjectURL(href)
    else window.webkitURL.revokeObjectURL(href)
    document.body.removeChild(downloadElement)
    return
  }
}
