import React from 'react'

const useNetwork = () => {

    const [downlink, setDownlink] = React.useState(null)

    const [autoQuality, setAutoQuality] = React.useState(null)

    React.useEffect(() => {
        if (navigator.connection) {
          setDownlink(navigator.connection.downlink)
        } else {
          setDownlink(null)
        }
      }, [])

      React.useEffect(()=> {
        if(downlink) {
            if(downlink > 2) setAutoQuality('HD')
            else setAutoQuality('SD')
        }
        else setAutoQuality('SD')

      },[downlink])

  return {
    autoQuality
  }
}

export default useNetwork