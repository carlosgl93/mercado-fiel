import { Apoyo } from '@/api/supportRequests';
import { ModalContent, StyledModal } from '@/components/ChatModal/ChatModalStyledComponents';
import { EnviarMensaje } from '@/components/ChatModal/EnviarMensaje';
import Loading from '@/components/Loading';
import { Prestador } from '@/store/auth/prestador';
import { User } from '@/store/auth/user';

type ChatModalProps = {
  open: boolean;
  handleClose: () => void;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  apoyo?: Apoyo;
  customer: User;
  prestador: Prestador;
};

const messageOptions = ['Hola, estoy disponible para ayudarte!'];

export const VerApoyoChatModal = ({
  open,
  handleClose,
  message,
  setMessage,
  isLoading,
  apoyo,
  customer,
  prestador,
}: ChatModalProps) => {
  return (
    <StyledModal id="chatModal" open={open} onClose={handleClose}>
      <ModalContent>
        {isLoading ? (
          <Loading />
        ) : (
          <EnviarMensaje
            setMessage={setMessage}
            message={message}
            handleClose={handleClose}
            messagesOptions={messageOptions}
            apoyo={apoyo}
            customer={customer}
            prestador={prestador}
            sentBy="provider"
          />
        )}
      </ModalContent>
    </StyledModal>
  );
};
