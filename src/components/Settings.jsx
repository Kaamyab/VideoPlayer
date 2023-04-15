// Modules
import React, { useState } from 'react'
import { Transition } from '@headlessui/react'

// Icons
import { Monitor, Setting2, Subtitle, Timer1 } from 'iconsax-react'
import FourKIcon from './icons/4K.svg'
import HDIcon from './icons/HD.svg'
import SDIcon from './icons/SD.svg'

const Settings = ({ sources, selectedQuality, setQuality }) => {

    const [isOpen, setIsOpen] = useState(false)
    const [activeMenu, setActiveMenu] = useState('settings')
    const [menuHeight, setMenuHeight] = useState(null)

    const calcHeight = (event) => {
        // const height = event.offsetHeight;
        // setMenuHeight(height)
        console.log(event)
    }

    const onActiveRenderer = () => {
        switch (activeMenu) {
            case 'settings':

                break;

            default:
                break;
        }
    }

    const iconHandler = (quality) => {
        const resolution = quality.resolution
        switch (resolution[1]) {
            case '2160':
                return { src: FourKIcon, alt: "4k Icon" }
            case '1080':
                return { src: HDIcon, alt: "FullHD Icon" }
            case '720':
                return { src: HDIcon, alt: "HD Icon" }
            case '480':
                return { src: SDIcon, alt: "SD Icon" }
            default:
                if (Number(resolution[1]) > 1080) {
                    return { src: HDIcon, alt: "FullHD Icon" }
                } else if (Number(resolution[1] > 720)) {
                    return { src: HDIcon, alt: "HD Icon" }
                } else return { src: SDIcon, alt: "SD Icon" }
        }
    }

    return (
        <div className='relative text-white'>
            <Setting2 size={24} onClick={() => setIsOpen(!isOpen)} />
            <Transition
                show={isOpen}
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className='absolute overflow-x-hidden w-56 h-40 bg-zinc-900 bg-opacity-90 -translate-x-3/4 -translate-y-1/4 inset-0 m-auto mb-0 bottom-24 rounded-lg transition-all p-2 [&>*]:block'>

                    {/* Primary */}
                    <Transition
                        show={activeMenu === 'settings'}
                        enter='transition-all duration-300'
                        enterFrom='-translate-x-[110%]'
                        enterTo='translate-x-[0]'
                        leave='transition-all duration-300'
                        leaveFrom='translate-x-[0]'
                        leaveTo='-translate-x-[110%]'
                        unmount={false}
                    >
                        <div>
                            <div className='flex flex-col gap-2'>
                                <h5 className='flex items-center gap-2 px-2 py-1 text-sm '>
                                    Settings
                                </h5>
                                <div className='w-full h-[1px] bg-white/20' />
                            </div>
                            <ul className='w-full flex flex-col text-sm hover:[&>*]:bg-white/10 [&>*]:p-2 [&>*]:rounded-md [&>*]:flex [&>*]:gap-2 [&>*]:items-center [&>*]:w-full
                    [&>li>div]:w-full [&>li>div]:flex [&>li>div]:justify-between'>
                                <li onClick={() => setActiveMenu('quality')}>
                                    <Monitor size="24" color="#fff" variant="Bold" className='w-5 h-5 shrink-0' />
                                    <div>
                                        <span>Quality</span>
                                        <span>1080p</span>
                                    </div>
                                </li>
                                <li>
                                    <Timer1 size="32" color="#fff" variant="Bold" className='w-5 h-5' />
                                    <div>
                                        <span>Playback Speed</span>
                                        <span>1x</span>
                                    </div>
                                </li>
                                <li>
                                    <Subtitle size="32" color="#fff" variant="Bold" className='w-5 h-5' />
                                    <div>
                                        <span>Subtitle</span>
                                        <span>Off</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </Transition>

                    {/* Secondary */}
                    <Transition
                        show={activeMenu === 'quality'}
                        enter='transition-all duration-300'
                        enterFrom='translate-x-[110%]'
                        enterTo='translate-x-[0]'
                        leave='transition-all duration-300'
                        leaveFrom='translate-x-[0]'
                        leaveTo='translate-x-[110%]'
                        unmount={false}
                    >
                        <div className=''>
                            <div className='flex flex-col gap-2'>
                                <h5 onClick={() => setActiveMenu('settings')} className='flex items-center gap-2 px-2 py-1 text-sm '>
                                    Quality
                                </h5>
                                <div className='w-full h-[1px] bg-white/20' />
                            </div>
                            <ul className='w-full flex flex-col text-sm hover:[&>*]:bg-white/10 [&>*]:p-2 [&>*]:rounded-md [&>*]:flex [&>*]:gap-2 [&>*]:items-center [&>*]:w-full
                    [&>li>div]:w-full [&>li>div]:flex [&>li>div]:justify-between'>
                                <li onClick={() => setQuality(sources[1])}>
                                    {/* <img src={FourKIcon} alt='4k' className='w-5 h-5' /> */}
                                    <div className='last:[&>*]:text-xs last:[&>*]:text-white/50 items-center'>
                                        <span>Auto</span>
                                        <span></span>
                                    </div>
                                </li>
                                {sources.map(quality => {
                                    return (
                                        <li key={quality.name} onClick={() => setQuality(quality.name)} className={`${selectedQuality.name == quality.name ? 'bg-white/10' : ''}`}>
                                            <img {...iconHandler(quality)} className='w-5 h-5' />
                                            <div className={`last:[&>*]:text-xs last:[&>*]:text-white/50 items-center`}>
                                                <span>{quality.name}</span>
                                                <span>{quality.resolution.join('*')}</span>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </Transition>

                </div>
            </Transition>
        </div>
    )
}

export default Settings