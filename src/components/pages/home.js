import React from 'react';
import Header from '../ui/landing/header';
import Hero from '../ui/landing/hero';
import Features from '../ui/landing/features.js';
import Footer from '../ui/landing/footer.js';
import Popup from '../ui/popup.js';
import settings from '../../lib/settings.js';
import { REGISTER_USER, LOGIN_USER, FORGOT_PASSWORD, SUBSCRIBE_EMAIL } from '../../lib/queries.js';

const Home = props => {
  const [popup, setPopup] = React.useState({type: 2, show: false});
  const [state, setState] = React.useState({disabled: false, error: ''});
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onClickGetStarted = e => {
    e.preventDefault();
    setUsername('');
    setEmail('');
    setPassword('');
    setState({disabled: false, error: ''})
    setPopup({type: 2, show: !popup.show});
  }

  const onClickSubscribe = e => {
    e.preventDefault();
    setUsername('');
    setEmail('');
    setPassword('');
    setState({disabled: false, error: ''})
    setPopup({type: 5, show: true})
  }

  const onClickSubscribePopup = () => {
    fetch(settings.apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: SUBSCRIBE_EMAIL,
        variables: { email },
      })
    }).then(r => r.json())
    .then(data => {
      if(data.errors) {
        setState({disabled: false, error: data.errors[0].message})
      }
      else {
        setPopup({type: 6, show: true})
      }
    })
  }
  const onClickRegister = e => {
    e.preventDefault();
    setState({disabled: true, error: ''});
    fetch(settings.apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: REGISTER_USER,
        variables: { username, email, password },
      })
  }).then(r => r.json())
    .then(data => {
      if(data.errors){
        setState({disabled: false, error: data.errors[0].message})
      }
      else{
        setPopup({type: 3, show: true})
      }
    });
  }

  const onClickLogin = e => {
    e.preventDefault();
    setState({disabled: true, error: ''});
    fetch(settings.apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: LOGIN_USER,
        variables: { email, password},
      })
    }).then(r => r.json())
    .then(data => {
      if(data.errors){
        setState({disabled: false, error: data.errors[0].message})
      }
      else{
        const userData = data.data.loginUser;
        if(userData.user.isConfirmed === false){
          setPopup({type: 3, show: true})
        }
        else {
          props.setUser({isLogged: true, token: userData.token, id: userData.user.id, username: userData.user.username})
          props.history.push('/dashboard')
        }
      }
    })
  }

  const onClickForgotPassword = () => {
      if(!email.length) return setState({disabled: false, error: 'Lütfen hesabınızın email adresini girin.'});
      fetch(settings.apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: FORGOT_PASSWORD,
          variables: { email }
        })
      }).then(r => r.json())
      .then(data => {
        if(data.errors){
          setState({disabled: false, error: data.errors[0].message})
        }
        else {
          setPopup({type: 4, show: true})
        }
      })
  }

  const showPopup = () => {
    if(popup.show === false) return null;
    if(popup.type == 1){
      return (
        <Popup>
          <div className="flex justify-end pb-3">
            <div onClick={() => setPopup({type: 2, show: false})} className="modal-close cursor-pointer z-50">
              <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </div>
          </div>
          <div className="flex justify-center"><h2 className="text-4x1 font-bold">Kayıt Ol</h2></div>
          <form className={`pt-6 pb-2 my-2 ${state.disabled === true ? "pointer-events-none" : ""}`}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="username">
                Kullanıcı Adı
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Kullanıcı Adınız"/>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="email">
                Email Adresi
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="email" type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Adresiniz"/>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2" htmlFor="password">
                Şifre
              </label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3" id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Şifrenizi Girin"/>
            </div>
            {state.error.length > 0 &&
              <div className="mb-3">
                <span className="text-sm text-red-500">
                  {state.error}
                </span>
              </div>
            }
            <a href="/" onClick={e => onClickRegister(e)} className="whitespace-no-wrap inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150 w-full">
              Kayıt Ol
            </a>
            <p className="mt-2 text-sm leading-6 text-gray-500 mb-6">
              Kayıt olarak, <span className="text-blue-500 cursor-pointer">kullanım şartları</span> ve <span className="text-blue-500 cursor-pointer">gizlilik politikasını</span> kabul etmiş sayılırsınız.
            </p>
            <div className="flex justify-center bg-gray-200">
              <p className="text-base leading-6">
                Hesabınız var mı? <span onClick={() => setPopup({type: 2, show: true})} className="text-blue-500 cursor-pointer">Hemen giriş yapın!</span>
              </p>
            </div>
          </form>
        </Popup>
      )
    }
    else if(popup.type == 2){
      return (
        <Popup>
          <div className="flex justify-end pb-3">
            <div onClick={() => setPopup({type: 2, show: false})} className="modal-close cursor-pointer z-50">
              <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </div>
          </div>
          <div className="flex justify-center"><h2 className="text-4x1 font-bold">Giriş Yap</h2></div>
          <form className={`pt-6 pb-2 my-2 ${state.disabled === true ? "pointer-events-none" : ""}`}>
           <div className="mb-4">
             <label className="block text-sm font-bold mb-2" htmlFor="email">
               Email Adresi
             </label>
             <input className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="email" value={email} onChange={e => setEmail(e.target.value)} type="text" placeholder="Email Adresiniz"/>
           </div>
           <div className="mb-6">
             <label className="block text-sm font-bold mb-2" htmlFor="password">
               Şifre
             </label>
             <input className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3" id="password" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Şifrenizi Girin"/>
           </div>
           {state.error.length > 0 &&
             <div className="mb-3">
               <span className="text-sm text-red-500">
                 {state.error}
               </span>
             </div>
           }
           <a href="/" onClick={e => onClickLogin(e)} className="whitespace-no-wrap inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150 w-full">
             Giriş Yap
           </a>
           <p onClick={onClickForgotPassword} className="mt-2 leading-6 text-blue-500 mb-6 cursor-pointer">
             Şifrenizi mi unuttunuz?
           </p>
           <div className="flex justify-center bg-gray-200">
             <p className="text-base leading-6">
               Hesabınız yok mu? <span onClick={() => setPopup({type: 1, show: true})} className="text-blue-500 cursor-pointer">Hemen kayıt olun!</span>
             </p>
           </div>
         </form>
        </Popup>
      )
    }
    else if(popup.type == 3){
      return (
        <Popup>
          <div className="flex justify-end pb-3">
            <div onClick={() => setPopup({type: 2, show: false})} className="modal-close cursor-pointer z-50">
              <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </div>
          </div>
          <div className="flex justify-center mb-3"><h2 className="text-4x1 font-bold">Son bir adım!</h2></div>
          <p className="text-base leading-6">
            <span className="font-bold">{email} </span> email adresine aktivasyon linki içeren bir mail gönderildi. Hesabınızı kullanabilmek için hesabınızı onaylamanız gerekiyor.
          </p>
        </Popup>
      )
    }
    else if(popup.type == 4) {
      return (
        <Popup>
          <div className="flex justify-end pb-3">
            <div onClick={() => setPopup({type: 2, show: false})} className="modal-close cursor-pointer z-50">
              <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </div>
          </div>
          <div className="flex justify-center mb-3"><h2 className="text-4x1 font-bold">Şifre Değiştirme Onayı</h2></div>
          <p className="text-base leading-6">
            <span className="font-bold">{email} </span> email adresine şifre değiştirme onayı içeren bir mail gönderildi. Şifrenizi değiştirebilmek için onay vermelisiniz.
          </p>
        </Popup>
      )
    }
    else if(popup.type == 5) {
      return (
        <Popup>
          <div className="flex justify-end pb-3">
            <div onClick={() => setPopup({type: 2, show: false})} className="modal-close cursor-pointer z-50">
              <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </div>
          </div>
          <div className="flex justify-center mb-3"><h2 className="text-4x1 font-bold">Abone Ol</h2></div>
          <p className="text-base leading-6 mb-3">
            Ücretsiz bir şekilde abone olarak yeniliklerden haberdar olmak için aşağıya e-mail adresinizi yazmalısınız. E-mail adresleri tamamen gizli tutulmaktadır, dilediğiniz zaman abonelikten çıkabilirsiniz.
          </p>
          {state.error.length > 0 && <p className="text-sm text-red-500">{state.error}</p>}
          <input className="mb-6 shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="email" value={email} onChange={e => setEmail(e.target.value)} type="text" placeholder="Email Adresiniz"/>
          <p onClick={onClickSubscribePopup} className="whitespace-no-wrap cursor-pointer inline-flex w-full items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150">
            Abone Ol
          </p>
        </Popup>
      )
    }
    else if(popup.type == 6) {
      return (
        <Popup>
          <div className="flex justify-end pb-3">
            <div onClick={() => setPopup({type: 2, show: false})} className="modal-close cursor-pointer z-50">
              <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </div>
          </div>
          <div className="flex justify-center mb-3"><h2 className="text-4x1 font-bold">Teşekkürler!</h2></div>
          <p className="text-base leading-6">
            E-mail adresi başarıyla sisteme kayıt edildi. Artık yeniliklerden haberdar olacaksınız, dilediğiniz zaman abonelikten çıkabilirsiniz.
          </p>
        </Popup>
      )
    }
  }
  if(props.user.isLoading === true) {
    return (
      <div className="w-full h-full flex justify-center">
        <span className="text-green-500 opacity-75 top-1/2 my-0 block relative w-0 h-0 mb-24 mr-24" style={{top: '50%'}}>
          <i className="fas fa-circle-notch fa-spin fa-5x"></i>
        </span>
      </div>
    )
  }
  if(props.user.isLogged === true) {
    setTimeout(() => props.history.push('/dashboard'), 250);
    return null;
  }
  return (
    <div>
      <Header onClickGetStarted={onClickGetStarted} onClickSubscribe={onClickSubscribe}/>
      <Hero onClickGetStarted={onClickGetStarted} onClickSubscribe={onClickSubscribe}/>
      <Features/>
      <Footer/>
      {showPopup()}
    </div>
  )
}

export default Home;
