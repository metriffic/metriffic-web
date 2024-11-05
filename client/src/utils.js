const compile_header = () => {
    return {
        "Content-Type": "application/json",
      }
}
                    
const fetch_get = async (...args) => {
    let [resource, config ] = args
    if(config) {
        resource += '?' + new URLSearchParams(config)
    }
    let response = await fetch(resource, {
                                   method: "GET",
                                   headers: compile_header(),
                               })
    if(response.status === 401) {
        // console.log('DISPATCHING google_login_failure!')
        // const google_login_failure = new CustomEvent("google_login_failure", { detail: response.status });
        // window.dispatchEvent(google_login_failure);
    }
    return response;
}


const fetch_post = async (...args) => {
    let [resource, config ] = args
    if(config) {
        resource += '?' + config
    }
    const body = config ? JSON.stringify(config) : undefined
    let response = await fetch(resource, {
                                   method: "POST",
                                   //mode:"no-cors",
                                   headers: compile_header(),
                                   body: body
                               })
    if(response.status === 401) {
        // console.log('DISPATCHING google_login_failure!')
        // const google_login_failure = new CustomEvent("google_login_failure", { detail: response.status });
        // window.dispatchEvent(google_login_failure);
    }
    return response;
}

export {
    fetch_get,
    fetch_post,
}