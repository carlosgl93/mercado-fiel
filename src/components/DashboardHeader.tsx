import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  alpha,
  Box,
  Breadcrumbs,
  IconButton,
  Link,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { ReactNode } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface DashboardHeaderProps {
  /**
   * Page title displayed in desktop view
   */
  title: string;
  /**
   * Page description displayed below the title in desktop view
   */
  description?: string;
  /**
   * Icon to display next to the title
   */
  icon?: ReactNode;
  /**
   * Breadcrumb items. The last item is automatically treated as the current page
   */
  breadcrumbs: BreadcrumbItem[];
  /**
   * Handler for the back button
   */
  onBack: () => void;
  /**
   * Additional action buttons to display on desktop (right side)
   */
  actions?: ReactNode;
  /**
   * Custom background color (defaults to primary.main)
   */
  backgroundColor?: string;
  /**
   * Custom text color (defaults to primary.contrastText)
   */
  textColor?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  description,
  icon,
  breadcrumbs,
  onBack,
  actions,
  backgroundColor,
  textColor,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const bgColor = backgroundColor || 'primary.main';
  const txtColor = textColor || 'primary.contrastText';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        bgcolor: bgColor,
        color: txtColor,
        borderRadius: 2,
      }}
    >
      <Box display="flex" alignItems="center">
        <IconButton
          onClick={onBack}
          sx={{
            mr: 2,
            color: txtColor,
            '&:hover': {
              bgcolor: alpha(
                backgroundColor
                  ? theme.palette.getContrastText(backgroundColor)
                  : theme.palette.primary.contrastText,
                0.1,
              ),
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box flexGrow={1}>
          <Breadcrumbs
            aria-label="breadcrumb"
            sx={{
              mb: 1,
              '& .MuiBreadcrumbs-separator': {
                color: txtColor,
              },
            }}
          >
            {breadcrumbs.map((breadcrumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              if (isLast) {
                return (
                  <Typography key={index} color="inherit">
                    {breadcrumb.label}
                  </Typography>
                );
              }

              return (
                <Link
                  key={index}
                  underline="hover"
                  color="inherit"
                  href={breadcrumb.href || '#'}
                  onClick={(e) => {
                    if (breadcrumb.onClick) {
                      e.preventDefault();
                      breadcrumb.onClick();
                    }
                  }}
                  sx={{ color: txtColor }}
                >
                  {breadcrumb.label}
                </Link>
              );
            })}
          </Breadcrumbs>

          {!isMobile && (
            <>
              <Typography
                variant="h4"
                component="h1"
                display="flex"
                alignItems="center"
                color="inherit"
                sx={{ mb: description ? 1 : 0 }}
              >
                {icon && (
                  <Box
                    component="span"
                    sx={{ mr: 2, fontSize: 32, display: 'flex', alignItems: 'center' }}
                  >
                    {icon}
                  </Box>
                )}
                {title}
              </Typography>

              {description && (
                <Typography variant="body1" color="inherit" sx={{ opacity: 0.9 }}>
                  {description}
                </Typography>
              )}
            </>
          )}
        </Box>

        {/* Actions for Desktop */}
        {!isMobile && actions && <Box sx={{ display: 'flex', gap: 1 }}>{actions}</Box>}
      </Box>
    </Paper>
  );
};

export default DashboardHeader;
