import styles from '../styles/sideBar.module.css'
import ComputerIcon from '@mui/icons-material/Computer';
import MusicNoteOutlinedIcon from '@mui/icons-material/MusicNoteOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CircleNotificationsOutlinedIcon from '@mui/icons-material/CircleNotificationsOutlined';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

export default function SideBar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.categorySidebar}>
        <h1 style={{ padding: '10px 20px' }}>Explore</h1>
        <div className={styles.categoryListSidebar}>
          <a href="" className={styles.sidebarLink}>
            <Stack direction="row" alignItems="center" gap={1}>
              <ComputerIcon />
              <Typography variant="body1">Tech</Typography>
            </Stack>
          </a>
          <a href="" className={styles.sidebarLink}>
            <Stack direction="row" alignItems="center" gap={1}>
              <MusicNoteOutlinedIcon />
              <Typography variant="body1">Concerts</Typography>
            </Stack>
          </a>
        </div>
        <hr />
        <div className={styles.sidebarDown}>
          <a href="" className={styles.sidebarLink}>
            <Stack direction="row" alignItems="center" gap={1}>
              <AccountCircleOutlinedIcon/>
              <Typography variant="body1">Profile</Typography>
            </Stack>
          </a>
          <a href="" className={styles.sidebarLink}>
            <Stack direction="row" alignItems="center" gap={1}>
             <CircleNotificationsOutlinedIcon/>
              <Typography variant="body1">Notifications</Typography>
            </Stack>
          </a>
        </div>
      </div>
    </div>
  );
}