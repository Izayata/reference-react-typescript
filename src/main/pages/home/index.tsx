import './css/home-page-container.css'
import './css/banner-element-img.css'
import './css/banner-element-container.css'
import './css/banner-element-img-container.css'
import './css/banner-movement-animation.css'
import './css/banner-paragraph-style.css'
import './css/banner-separator.css'
import './css/szezonalis-esemenyunk-container.css'

import { useState, useEffect } from 'react'
import { sleep } from '../../utils/sleep/SleepUtils'

export function Home() {
  const [bannerState, setBannerState] = useState<'borstoro-boldizsar' | 'alapanyagaink' | 'honap-kedvence'>('borstoro-boldizsar')

  useEffect(() => {
    const changeBanner = async () => {
      await sleep(30000)
      if (bannerState === 'alapanyagaink') {
        setBannerState('honap-kedvence')
        return
      }
      if (bannerState === 'borstoro-boldizsar') {
        setBannerState('alapanyagaink')
        return
      }
      if (bannerState === 'honap-kedvence') {
        setBannerState('borstoro-boldizsar')
        return
      }
    }

    changeBanner()
  }, [bannerState])

  return (
    <div className='home-page-container'>
      {bannerState === 'borstoro-boldizsar' && (
        <div className='banner-element-container banner-movement-animation' style={{backgroundColor: 'darkkhaki'}}>
          <div className='banner-element-img-container'>
            <img className="banner-element-img" src="https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg" alt="Source: https://www.pexels.com/photo/man-in-white-dress-shirt-wearing-eyeglasses-3814446/" />
          </div>
          <p className='banner-paragraph-style'>
            Üdvözöljük éttermünkben! Borstörő Boldizsár vagyok, főszakács és tulajdonos. 
            Kisgyermekkoromban sokat figyeltem édesapámat, ahogy szenvedélyének élt és
            finomabbnál finomabb ételeket készített a szeretteinek. Az energia, amit
            tanúsított és a számos csodálatos étel hamar megérintettek és adtak számomra
            egy álmot, hogy egyszer a saját éttermemben készíthetek majd az embereknek
            olyan ételeket, amelyek minden képzeletüket felülmúlóan felejthetetlen élményt nyújtanak számukra.
            <br />
            <br />          
            Biztosíthatok minden kedves vendéget, hogy nevemmel ellentétben nem szokásom mások orra alá borsot törni.
            Ételeinkhez jó étvágyat kívánunk!
          </p>
        </div>
      )}
      {bannerState === 'alapanyagaink' && (
        <div className='banner-element-container banner-movement-animation' style={{backgroundColor: 'burlywood'}}>
          <div className='banner-element-img-container'>
            <img className='banner-element-img' src="https://images.pexels.com/photos/4252142/pexels-photo-4252142.jpeg" alt="Source: https://www.pexels.com/photo/person-slicing-vegetable-on-chopping-board-4252142/" />
          </div>
          <p className='banner-paragraph-style'>
            Számunkra a vendégek az elsők, így éttermünkben kiemelt hangsúlyt fektetünk a minőségre és a frissességre.
            Minden egyes alapanyagunkat gondosan válogatjuk ki, partnereinket pedig szigorúan választjuk meg.
            Hisszük, hogy a legjobb alapanyag az az alapanyag, amely törődéssel, figyelemmel és szeretettel neveltetett!
          </p>
        </div>
        
      )}
      {bannerState === 'honap-kedvence' && (
        <div className='banner-element-container banner-movement-animation' style={{backgroundColor: 'darksalmon'}}>
          <div className='banner-element-img-container'>
            <img
              className='banner-element-img'
              src="https://gabykonyha.hu/wp-content/uploads/2021/11/Glutenmentes-vegan-sutotokos-gnocchi-16.jpg"
              alt="Source: https://gabykonyha.hu/mindenmentes-foetelek/sutotokos-gnocchi-pestos-gombaval/"
              style={{transform: 'scale(1.5) translateY(-7px)'}}
            />
          </div>
          <p className='banner-paragraph-style'>
            Egy újabb hónap, egy újabb kedvenc étel! Ebben a hónapban a séfünk különleges ajánlata
            a &quot;Sütőtökös gnocchi fűszeres vajmártással&quot;, amely tökéletesen ötvözi a sütőtök édes ízét
            a fűszeres vajmártás gazdagságával. Ez az étel nemcsak ízletes, hanem tápláló is,
            és garantáltan elvarázsolja az ízlelőbimbókat. Ne hagyja ki ezt a különleges ajánlatot,
            és kóstolja meg éttermünkben a séfünk által gondosan elkészített fogást!
          </p>
        </div>
        
      )}
      <div
        className='banner-separator'
      />
      <div
        className='szezonalis-esemenyunk-container'
        style={{backgroundColor: 'tan'}}
      >
        <h3 className='page-title'>Szezonális tematikánk</h3>
        <div className='banner-element-container gandalf'>
          <div className='banner-element-img-container'>
            <img
              className='banner-element-img'
              src="https://i.imgur.com/h6ThbK3.gif"
              alt="Source: https://imgur.com/gallery/gandalf-meme-iDFAmpX"
              style={{transform: 'scale(2.4) translateY(-7px)'}}
            />
          </div>
          <p className='banner-paragraph-style'>
            Éttermünkben minden évszakban különleges tematikával várjuk vendégeinket!
            Ahogy az idő egyre inkább lehűl, úgy szeretnek az emberek egyre többen az otthonukban maradni és elmerülni képzeletükben.
            Van aki a paplan alá bújva egy jó könyvet olvas egy finom forró csokoládé mellett,
            van aki a kedvenc sorozatát nézi és van aki más kreatív tevékenységgel üti el az időt.
            Miért ne lehetne ezeket a tevékenységeket egy finom, szezonális étel mellett végezni?
            Éttermünkben minden évszakban megújuló tematikával és szezonális ételekkel várjuk vendégeinket,
            hogy otthonosabbá és meghittebbé tegyük az étkezési élményt.
            Legyen szó egy forró levesről a hideg téli napokon, egy friss salátáról a nyári melegben
            vagy egy gazdag pörköltről az őszi estéken, nálunk mindig talál olyan ételt,
            amely tökéletesen illik az adott évszak hangulatához.
            A menü folyamatosan változik, így mindig új ízekkel és élményekkel várjuk vendégeinket.
            Idén ősszel éttermünkben a fantázia világa van a központban, így több neves fantázia alkotásból ihletett étellel találkozhatnak nálunk.
            Látogasson el hozzánk és élvezze a szezonális tematikánkat!
          </p>
        </div>
      </div>
      <div
        className='banner-separator'
      />
      <div
        className='szezonalis-esemenyunk-container'
        style={{backgroundColor: 'peru'}}
      >
        <h3 className='page-title'>Állatbarátak vagyunk</h3>
        <div className='banner-element-container'>
          <div className='banner-element-img-container'>
            <img
              className='banner-element-img'
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhZBMVaQr0eh6HV4J_jkNj5Wd7DelB8m5y6rQn1dFrMTOFDpDzPstZGdp08nRnkNNFPaYhOfwWm_M61N-hLE4_Z6yBvHQY2CMjZ137RA"
              alt="Source: https://www.hobbyfarms.com/are-corgis-good-farm-dogs/"
              style={{transform: 'scale(1.5)'}}
            />
          </div>
          <p className='banner-paragraph-style'>
            Éttermünkben szívesen látunk négylábú barátokat is! Hiszünk abban, hogy az étkezés élménye akkor teljes,
            ha minden családtag, beleértve a házi kedvenceket is, részt vehet benne. Különleges, állatbarát környezetet alakítottunk ki,
            ahol kutyák és más kisállatok is kényelmesen érezhetik magukat. Éttermünkben friss vízzel és finom falatokkal várjuk őket,
            hogy ők is élvezhessék a vendéglátás örömeit.
            <br />
            <br />
            <span style={{fontStyle: 'italic', textAlign: 'left'}}>
              (Állatbarát menünkről és szolgáltatásainkról személyzetünknél érdeklődhet.)
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
