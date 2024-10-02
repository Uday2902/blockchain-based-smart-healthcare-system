import React from "react";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import ShareIcon from '@mui/icons-material/Share';
// import MoreVertIcon from '@mui/icons-material/MoreVert';


const CardComponent = ({ element }) => { 


console.log(element)
  return (
    
    <Card sx={{ maxWidth: 250, height: 250, overflow: 'hidden' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            I
          </IconButton>
        }
        title={element.title}
        subheader="September 14, 2016"
      />
      <CardMedia
        component="img"
        style={{ width: '300px', height: '200px', objectFit: 'cover' }}
        image={element.thumbnailUrl}
        alt="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {element.title}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
        I
        </IconButton>
        <IconButton aria-label="share">
          I
        </IconButton>
      </CardActions>
    </Card>
    
  );
};

export default CardComponent;
