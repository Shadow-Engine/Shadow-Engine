# Audio Spatialization
A lot of the info on audio spatialization in Shadow Engine is from this incredible article ["3D sound spatialization with game engines: the virtual acoustics performance of a game engine and a middleware for interactive audio design"](https://link.springer.com/article/10.1007/s10055-021-00589-0)


## Sound propagation
*"In theory, the analysis of sound propagation is done in the three main stages; source, transmission path and receiver. This article dwells on the acoustic propagation where the sound is reflected, scattered, diffracted, absorbed or occluded."*

Almost like raytracing but for audio. We need to be able to simplify this however to reduce on computation.

Three main parts to sound propagation, Direct Sound, Early Reflections, and Late Reverberations.

#### Direct Sound
As you would expect, direct sound is the Source audio going directly to the Reciever without interference.
#### Early Reflections
Sound that arrives 50 or 80 ms after direct sound. Carry important information of source localization. Affect the width and timbre of sound and its spaciousness.
#### Late Reverberations
Remaining energy reflected and arrives after the Early Reflections. Unlike Early Reflections, they contain little directional information, but helps form the *diffuse* sound field.

![[Sound Propagation Types.png]]

### Reverberation Time calculation
`RT` = Reverberation Time
`V` = Volume of room
`S` = Total surface area
`α` = Average absorption coefficient

$$ RT=0.16\frac{V}{S\alpha } $$
Some sort of "room volume" calculation would need to be put in place inside Shadow Engine, and an implementation for outdoor scenes.

## *Direct Sound* Simulation in UE4
Unreal Engine supports different equations for Direct Sound, the two most important parts being distance between reciever and source, and the absorption of the transmission medium. ISO standardizes this in "ISO 9613–2 Acoustics—Attenuation of sound during propagation outdoors" The two main variants of attenuation, described in the standard as *Geometrical Divergence Attenuation (A<sub>div</sub>)* and *Atmospheric Absorption Attenuation (A<sub>Atm</sub>)*

Here are UE4's equations

$$Linear=1.0\mathrm{ f}-\left(\frac{d}{fod}\right)$$

$$Logarithmic=0.5\mathrm{ f}-log\left(\frac{d}{fod}\right)$$
$$Inverse=0.02\mathrm{ f }/\left(\frac{d}{fod}\right)$$
$$LogReverse=1.0\mathrm{ f}+0.5 log\left(1-\frac{d}{fod}\right)$$
$$Natural Sound={10.0\mathrm{ f}}^{\left(\left(\frac{d}{fod}\right)*\left(\frac{dBMax}{20}\right)\right)}$$
$f=\frac{Fall\,off\,Distance}{\mathrm{Inner\,Radius}}$

`Inner radius` = The minimum distance from the sound source where attenuation will be applied

`fod` = _Falloff Distance_ is the maximum distance from the sound source where attenuation will be applied

`d` = The current distance of receiver to the sound source

`dBMax` = The maximum *dB* attenuation at *Falloff Distance*

![[UE4 Attenuation functions.png]]