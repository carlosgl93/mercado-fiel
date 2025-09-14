import React, { ReactNode } from 'react';
import {
  Box,
  Button,
  Paper,
  useTheme,
} from '@mui/material';

export interface MobileActionBarProps {
  /**
   * Actions to display in the mobile action bar
   */
  children: ReactNode;
  /**
   * Whether the action bar should be sticky
   */
  sticky?: boolean;
  /**
   * Custom background color with transparency
   */
  backgroundColor?: string;
  /**
   * Custom border color
   */
  borderColor?: string;
  /**
   * Additional styling props
   */
  sx?: object;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({
  children,
  sticky = true,
  backgroundColor = 'rgba(255, 255, 255, 0.95)',
  borderColor = 'rgba(76, 175, 79, 0.2)',
  sx = {},
}) => {
  return (
    <Paper
      elevation={4}
      sx={{
        ...(sticky && {
          position: 'sticky',
          top: 16,
          zIndex: 1000,
        }),
        mb: 2,
        p: 2,
        textAlign: 'center',
        backgroundColor,
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
        border: `1px solid ${borderColor}`,
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
};

export default MobileActionBar;
