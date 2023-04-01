export default class API {
  static POST(
    data: any,
    url: string,
    successFunc: (data: any, req: XMLHttpRequest) => void,
    errorFunc: (data: any, req: XMLHttpRequest) => void,
    isFormData: boolean = false
  ) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", url, true);
    if (!isFormData) {
      xmlhttp.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded"
      );
      data = "data=" + JSON.stringify(data);
    }
    xmlhttp.send("data=" + JSON.stringify(data));
    xmlhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        successFunc(this.responseText, this);
      } else if (this.readyState === 4 && this.status !== 200) {
        errorFunc(this.responseText, this);
      }
    };
    return xmlhttp;
  }
}
