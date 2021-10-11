import { Image } from "react-native";

class ImageSizeEstimator {
    requestId = 1;
  
    requests = {} as any;
  
    private nextId() {
      return `request-${this.requestId++}`;
    }
  
    getSize(imgSrc: string, onComplete: (width: number, height: number) => void) {
      const requestId = this.nextId();
      const request = {
        onComplete: onComplete,
        cancel: () => {
          if (this.requests[requestId]) {
            delete this.requests[requestId];
          }
        }
      };
      Image.getSize(imgSrc, (width: number, height: number) => {
        const req = this.requests[requestId];
        if (req) {
          req.onComplete && req.onComplete(width, height);
          req.cancel();
        }
      }, () => {});
      this.requests[requestId] = request;
      return request.cancel;
    }
  }
  
export default new ImageSizeEstimator();