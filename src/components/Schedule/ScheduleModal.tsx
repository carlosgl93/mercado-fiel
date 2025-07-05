import { Scheduler } from './Scheduler';
import { ModalContent, StyledModal } from './StyledScheduleModal';

type ScheduleModalProps = {
  open: boolean;
  handleClose: () => void;
};

export const ScheduleModal = ({ open, handleClose }: ScheduleModalProps) => {
  return (
    <StyledModal id="scheduleModal" open={open} onClose={handleClose}>
      <ModalContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          overflow: 'scroll',
          height: '90%',
          width: '90%',
        }}
      >
        <Scheduler />
      </ModalContent>
    </StyledModal>
  );
};
