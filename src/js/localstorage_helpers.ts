


function changeApiServer(newHost, port) {
    cookies.set('apiInfo', {hostname: newHost, port: port})
    let apiInfo = ApiInfo;
    apiInfo.hostname = newHost;
    apiInfo.port = port;

   // saveApiInfo(apiInfo)
  //  .then(connectToAPI())
 // .then(console.log(ApiInfo))
    /*
    this.setState({ApiInfo: apiInfo}, () => {
      this.connectToAPI();
    });
    */
  }


  function setApiStatus(status) {
    let apiInfo = ApiInfo;
    if (status === 'indeed'){
      apiInfo.status = 'Online';
      //props.enqueueSnackbar('Connected to API server!', { variant: 'success' });
      /*
      this.setState({ApiInfo: apiInfo}, () => {
        API.contracts(ApiInfo)
          .then(data => data.contracts.map(contract => ({label: contract, value: contract})))
          .then(contractList => this.setState({contractList}))
        });
        */
    }else{
      this.handleApiError();
    }
  }

  function handleApiError(error) {
    let apiInfo = ApiInfo;
    apiInfo.status = 'Offline';

    this.setState({ApiInfo: apiInfo}, () => {
      if (!error){
        //props.enqueueSnackbar('Unknown API Server Error', { variant: 'error' });
        return
      } 
      if (error.message === 'Failed to fetch'){
        //props.enqueueSnackbar('Unable to connect to API endpoint ' + ApiInfo.hostname + ':' + ApiInfo.port + '. Check API settings.', { variant: 'error' });
        return;
      }
      //props.enqueueSnackbar(error, { variant: 'error' });
    });

  }