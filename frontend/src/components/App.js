import { useState, useEffect } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import { api } from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Authorization from './Authorization';
import { checkToken } from '../utils/auth';
import InfoTooltip from './InfoTooltip';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({ link: '', name: '' });
  const [currentUser, setCurrentUser] = useState({ name: '', about: '', avatar: '', _id: '' });
  const [cards, setCards] = useState([]);
  const [isLoadingEditProfile, setIsLoadingEditProfile] = useState(false);
  const [isLoadingAddPlace, setIsLoadingAddPlace] = useState(false);
  const [isLoadingEditAvatar, setIsLoadingEditAvatar] = useState(false);
  const [isLoadingConfirmDelete, setIsLoadingConfirmDelete] = useState(false);
  const [focusCardDelete, setFocusCardDelete] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [messageInfo, setMessageInfo] = useState('');
  const navigate = useNavigate();


  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };
  
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmDeletePopupOpen(false);
    setIsInfoPopupOpen(false);
    setSelectedCard({ link: '', name: '' })
  }

  const handleCardLike = (currCard) => {
    const isLiked = currCard.likes.some((like) => like === currentUser._id);
    
    !isLiked
      ? api.sendLike(currCard._id)
          .then((newCard) => {
            setCards((prevState) => prevState.map((card) => card._id === currCard._id ? newCard.data : card));
          })
          .catch((err) => console.log(err))
      : api.deleteLike(currCard._id)
          .then((newCard) => {
            setCards((prevState) => prevState.map((card) => card._id === currCard._id ? newCard.data : card));
          })
          .catch((err) => console.log(err));
  };

  const handleCardDelete = () => {
    setIsLoadingConfirmDelete(true);

    api.deleteCard(focusCardDelete._id)
      .then(() => {
        setCards((prevState) => prevState.filter((card) => card._id !== focusCardDelete._id));
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoadingConfirmDelete(false));
  };
  
  const handleUpdateUser = (user) => {
    setIsLoadingEditProfile(true);
    api.updateUserInfo(user)
      .then((newUserInfo) => {
        setCurrentUser(newUserInfo.user);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoadingEditProfile(false));
  };

  const handleUpdateAvatar = (avatar) => {
    setIsLoadingEditAvatar(true);
    api.updateUserAvatar(avatar)
      .then((newUserInfo) => {
        setCurrentUser(newUserInfo.user);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoadingEditAvatar(false));
  };

  const handleOpenInfoPopup = (isSuccess, message) => {
    setIsSuccess(isSuccess);
    setMessageInfo(message);
    setTimeout(() => {setIsInfoPopupOpen(true)}, 100);
  };

  const handleAddPlace = (dataCard) => {
    setIsLoadingAddPlace(true);
    api.sendCard(dataCard)
      .then((card) => {
        setCards([card.data, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoadingAddPlace(false));
  };

  const handleOpenConfirmDeletePopup = (currCard) => {
    setIsConfirmDeletePopupOpen(true);
    setFocusCardDelete(currCard);
  };

  const handleLogin = (isLogin) => {
    setLoggedIn(isLogin);
  }

  const handleEmail = (email) => { 
    setEmail(email); 
  } 

  const handleTokenCheck = () => {
    const token = localStorage.getItem('token');

    if (token) {
      checkToken(token)
        .then(({data}) => {
          setEmail(data.email);
          setLoggedIn(true);
          navigate('/');
        })
        .catch((err) => handleOpenInfoPopup(false, err));
    }
  };

  useEffect(() => {
    if (loggedIn) {
      api
        .getUserInfo()
        .then((userInfo) => {
          const { name, about, avatar, _id } = userInfo.data;
          setCurrentUser({ name, about, avatar, _id });
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      api
        .getCards()
        .then((cards) => setCards(cards.data))
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  useEffect(() => {
    handleTokenCheck();
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>

      <Header handleLogin={handleLogin} loggedIn={loggedIn} email={email} />
      <Routes>
        <Route path='/' element={
          <ProtectedRoute
            loggedIn={loggedIn}
            element={Main}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onOpenConfirmDeletePopup={handleOpenConfirmDeletePopup}
            cards={cards}
          />}
        />
        <Route path='/sign-up' element={
            <Authorization
              textHeading='Регистрация'
              textButton='Зарегистрироваться'
              onOpenInfoPopup={handleOpenInfoPopup}
            />
          }
        />
        <Route path='/sign-in' element={
            <Authorization
              handleEmail={handleEmail}
              handleLogin={handleLogin}
              textHeading='Вход'
              textButton='Войти'
              onOpenInfoPopup={handleOpenInfoPopup}
            />
          }
        />
        <Route path='*' element={<Navigate to='/sign-up' />} />
      </Routes>

      <Footer />

      <InfoTooltip isOpen={isInfoPopupOpen} onClose={closeAllPopups} isSuccess={isSuccess} messageInfo={messageInfo} />
      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} isLoading={isLoadingEditProfile} />
      <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlace} isLoading={isLoadingAddPlace} />
      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} isLoading={isLoadingEditAvatar} />
      <ConfirmDeletePopup isOpen={isConfirmDeletePopupOpen} onClose={closeAllPopups} onCardDelete={handleCardDelete} isLoading={isLoadingConfirmDelete}/>
      <ImagePopup card={selectedCard} onClose={closeAllPopups} />

    </CurrentUserContext.Provider>
  );
}

export default  App;
