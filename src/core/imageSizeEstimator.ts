import { remove } from "lodash-es";
import { Image } from "react-native";

interface Request {
    onComplete: (width: number, height: number) => void
    cancel : () => void
}

class ImageSizeEstimator {
    requestId = 1;
  
    requests: Map<String, Request[]> = new Map<string, Request[]>();

    private createRequest(requestId: string, onComplete: (width: number, height: number) => void) {
      const request = {} as Request;
      request.onComplete = onComplete,
      request.cancel = () => {
          if (this.requests.has(requestId)) {
            remove(this.requests.get(requestId) || [], request);
          }
      };
      return request;
    }

    private getImageSize(imgSrc: string) {
      Image.getSize(imgSrc, (width: number, height: number) => {
        const reqs = this.requests.get(imgSrc);
        if (reqs) {
          reqs.map(req => {
            req.onComplete && req.onComplete(width, height);
          });
          this.requests.delete(imgSrc);
        }
      }, () => this.requests.delete(imgSrc));
    }
  
    getSize(imgSrc: string, onComplete: (width: number, height: number) => void) {
      const requestId = imgSrc;
      const request = this.createRequest(requestId, onComplete);
      if (this.requests.has(requestId)) {
        this.requests.get(requestId)?.push(request);
      } else {
        const reqQueue = [] as Request[];
        this.requests.set(requestId, reqQueue);
        this.getImageSize(requestId);
      }
      return request.cancel;
    }
  }
  
export default new ImageSizeEstimator();