import PopupWithForm from './PopupWithForm';
import useClosePopup from '../hooks/useClosePopup';

export default function ConfirmDeletePopup({ isOpen, onClose, onCardDelete, isLoading }) {
  const textButton = isLoading ? 'Удаление...' : 'Да';
  useClosePopup(isOpen, onClose);
  const handleSubmit = (evt) => {
    evt.preventDefault();
    onCardDelete();
  }

  return (
    <PopupWithForm isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} isLoading={isLoading} name='confirm-delete' title='Вы уверены?' textButton={textButton} />
  );
}