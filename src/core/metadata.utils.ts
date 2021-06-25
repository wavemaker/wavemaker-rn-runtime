import axios from "axios";

export let serviceDefinitions= {};

export function getServiceDefinitions(url: string) {
  return new Promise((resolve, reject) => {
    axios.get(url + '/services/servicedefs')
      .then((response) => {
        serviceDefinitions = response.data?.serviceDefs;
      })
      .catch((error) => {
        console.log(error);
      })
      .then(() => {
        resolve(serviceDefinitions);
      });
  });

}
