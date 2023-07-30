import PopupWithForm from './PopupWithForm';
import { useEffect, useRef } from 'react';
import useClosePopup from '../hooks/useClosePopup';

export default function EditAvatarPopup({isOpen, onClose, onUpdateAvatar, isLoading}) {
  const avatarRef = useRef(null);
  const textButton = isLoading ? 'Сохранение...' : 'Сохранить';
  const handleSubmit = (evt) => {
    evt.preventDefault();
    onUpdateAvatar({ avatar: avatarRef.current.value });
  }
  useClosePopup(isOpen, onClose);
  useEffect(() => {
    avatarRef.current.value = '';
  }, [isOpen]);


  return (
    <PopupWithForm isOpen={isOpen} onClose={onClose}  onSubmit={handleSubmit} isLoading={isLoading} name='avatar' title='Обновить аватар' textButton={textButton}>
      <input ref={avatarRef} id="avatar-image-input" name="avatar" className="popup__input" type="url" placeholder="Ссылка на картинку" required/>
      <span className="avatar-image-input-error popup__error"></span>
    </PopupWithForm>
  );
}