import React from "react"

const useQuality = (sources) => {

    const [selected, setSelected] = React.useState(sources[sources.length-1])

    const onQualitySet = (name) => {
        const source = sources.find(source => source.name === name)
        setSelected(source)
        return selected
    }

    // React.useEffect(()=> {
    //     console.log(selected)
    // },[selected])

    return [
        selected,
        {
            setQuality: (name) => onQualitySet(name),
        }
]
}

export default useQuality;