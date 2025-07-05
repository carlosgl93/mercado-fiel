import Loading from '../Loading';
import { ModalContent, StyledModal } from './ChatModalStyledComponents';
import { EnviarMensaje } from './EnviarMensaje';

type ChatModalProps = {
  open: boolean;
  handleClose: () => void;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
};

export const ChatModal = ({
  open,
  handleClose,
  message,
  setMessage,
  isLoading,
}: ChatModalProps) => {
  return (
    <StyledModal id="chatModal" open={open} onClose={handleClose}>
      <ModalContent>
        {isLoading ? (
          <Loading />
        ) : (
          <EnviarMensaje setMessage={setMessage} message={message} handleClose={handleClose} />
        )}
      </ModalContent>
    </StyledModal>
  );
};
