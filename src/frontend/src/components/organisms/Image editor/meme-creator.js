'use client';

import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import {
  Close,
  ColorLens,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  TextFields,
} from '@mui/icons-material';
import { Box, Button, IconButton, Paper, Slider, TextField, Typography } from '@mui/material';

const MemeCreator = ({ onSave, onCancel, inlineMode = false }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [text, setText] = useState('');
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [textSelected, setTextSelected] = useState(false);
  const [textStyle, setTextStyle] = useState({
    fontSize: 30,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    color: '#ffffff',
    stroke: '#000000',
    strokeWidth: 1,
  });
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 500 });
  const [textBounds, setTextBounds] = useState({ width: 0, height: 0 });

  // Predefined colors for text
  const colorOptions = [
    '#ffffff', // white
    '#000000', // black
    '#ff0000', // red
    '#00ff00', // green
    '#0000ff', // blue
    '#ffff00', // yellow
    '#ff00ff', // magenta
    '#00ffff', // cyan
    '#ffa500', // orange
    '#800080', // purple
  ];

  // Handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          // Calculate canvas size based on image dimensions
          const maxWidth = 500;
          const maxHeight = 500;
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          setCanvasSize({ width, height });
          setImage(img);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate text bounds
  const calculateTextBounds = (ctx, text, fontSize) => {
    const metrics = ctx.measureText(text);
    const width = metrics.width;
    const height = fontSize;
    return { width, height };
  };

  // Draw the meme on canvas
  useEffect(() => {
    if (!canvasRef.current || !image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Draw text
    if (text) {
      ctx.font = `${textStyle.fontStyle} ${textStyle.fontWeight} ${textStyle.fontSize}px Arial`;
      ctx.fillStyle = textStyle.color;
      ctx.textAlign = 'center';

      // Calculate text bounds
      const bounds = calculateTextBounds(ctx, text, textStyle.fontSize);
      setTextBounds(bounds);

      console.log(textBounds);

      // Add stroke (outline)
      ctx.strokeStyle = textStyle.stroke;
      ctx.lineWidth = textStyle.strokeWidth;
      ctx.strokeText(text, textPosition.x, textPosition.y);

      // Fill text
      ctx.fillText(text, textPosition.x, textPosition.y);

      // Add underline if needed
      if (textStyle.textDecoration === 'underline') {
        ctx.beginPath();
        ctx.moveTo(textPosition.x - bounds.width / 2, textPosition.y + 5);
        ctx.lineTo(textPosition.x + bounds.width / 2, textPosition.y + 5);
        ctx.strokeStyle = textStyle.color;
        ctx.stroke();
      }

      // Draw selection box if text is selected
      if (textSelected) {
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);

        // Draw bounding box
        ctx.strokeRect(
          textPosition.x - bounds.width / 2 - 10,
          textPosition.y - bounds.height - 10,
          bounds.width + 20,
          bounds.height + 20
        );

        // Draw resize handle
        ctx.fillStyle = '#4a90e2';
        ctx.fillRect(
          textPosition.x + bounds.width / 2 + 5,
          textPosition.y - bounds.height / 2,
          10,
          10
        );

        ctx.setLineDash([]);
      }
    }
  }, [image, text, textPosition, textStyle, textSelected]);

  // Handle mouse events for dragging and resizing text
  const handleMouseDown = (e) => {
    if (!text) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate text bounds
    const bounds = calculateTextBounds(ctx, text, textStyle.fontSize);

    // Check if click is on resize handle
    const resizeHandleX = textPosition.x + bounds.width / 2 + 5;
    const resizeHandleY = textPosition.y - bounds.height / 2;

    if (
      textSelected &&
      x >= resizeHandleX &&
      x <= resizeHandleX + 10 &&
      y >= resizeHandleY &&
      y <= resizeHandleY + 10
    ) {
      setIsResizing(true);
      setDragStart({ x, y });
      return;
    }

    // Check if click is near text
    if (
      x >= textPosition.x - bounds.width / 2 - 10 &&
      x <= textPosition.x + bounds.width / 2 + 10 &&
      y >= textPosition.y - bounds.height - 10 &&
      y <= textPosition.y + 10
    ) {
      setIsDragging(true);
      setTextSelected(true);
      setDragStart({ x, y });
    } else {
      setTextSelected(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging && !isResizing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging) {
      const dx = x - dragStart.x;
      const dy = y - dragStart.y;

      setTextPosition({
        x: textPosition.x + dx,
        y: textPosition.y + dy,
      });

      setDragStart({ x, y });
    } else if (isResizing) {
      // Calculate new font size based on drag distance
      const dx = x - dragStart.x;
      const newSize = Math.max(10, textStyle.fontSize + dx / 2);

      setTextStyle({
        ...textStyle,
        fontSize: newSize,
      });

      setDragStart({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Handle text style changes
  const toggleBold = () => {
    setTextStyle({
      ...textStyle,
      fontWeight: textStyle.fontWeight === 'bold' ? 'normal' : 'bold',
    });
  };

  const toggleItalic = () => {
    setTextStyle({
      ...textStyle,
      fontStyle: textStyle.fontStyle === 'italic' ? 'normal' : 'italic',
    });
  };

  const toggleUnderline = () => {
    setTextStyle({
      ...textStyle,
      textDecoration: textStyle.textDecoration === 'underline' ? 'none' : 'underline',
    });
  };

  const handleFontSizeChange = (event, newValue) => {
    setTextStyle({
      ...textStyle,
      fontSize: newValue,
    });
  };

  const handleColorChange = (color) => {
    setTextStyle({
      ...textStyle,
      color: color,
    });
  };

  // Save the meme
  const handleSave = () => {
    if (!canvasRef.current) return;

    // Temporarily hide selection box for saving
    const wasSelected = textSelected;
    setTextSelected(false);

    // Use setTimeout to ensure the canvas is redrawn without selection box
    setTimeout(() => {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onSave(dataUrl, caption);

      // Restore selection state
      setTextSelected(wasSelected);
    }, 50);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {!inlineMode && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Create Meme</Typography>
          <IconButton onClick={onCancel}>
            <Close />
          </IconButton>
        </Box>
      )}

      {!image ? (
        <Paper
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #8a4fff',
            borderRadius: 2,
            bgcolor: 'rgba(138, 79, 255, 0.05)',
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: '#8a4fff' }}>
            Upload an image to create a meme
          </Typography>
          <Button
            variant="contained"
            component="label"
            startIcon={<TextFields />}
            sx={{
              bgcolor: '#8a4fff',
              '&:hover': { bgcolor: '#7a3fef' },
              borderRadius: 4,
            }}
          >
            Upload Image
            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          </Button>
        </Paper>
      ) : (
        <>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Add a caption for your meme..."
              variant="outlined"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Meme Text"
              variant="outlined"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <IconButton
              onClick={toggleBold}
              color={textStyle.fontWeight === 'bold' ? 'primary' : 'default'}
            >
              <FormatBold />
            </IconButton>
            <IconButton
              onClick={toggleItalic}
              color={textStyle.fontStyle === 'italic' ? 'primary' : 'default'}
            >
              <FormatItalic />
            </IconButton>
            <IconButton
              onClick={toggleUnderline}
              color={textStyle.textDecoration === 'underline' ? 'primary' : 'default'}
            >
              <FormatUnderlined />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              <ColorLens sx={{ color: textStyle.color, mr: 1 }} />
              <input
                type="color"
                value={textStyle.color}
                onChange={(e) => handleColorChange(e.target.value)}
                style={{ width: '30px', height: '30px', cursor: 'pointer' }}
              />
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Font Size: {Math.round(textStyle.fontSize)}px
            </Typography>
            <Slider
              value={textStyle.fontSize}
              min={10}
              max={100}
              step={1}
              onChange={handleFontSizeChange}
              aria-labelledby="font-size-slider"
              sx={{ color: '#8a4fff' }}
            />
            <Typography
              variant="body2"
              sx={{ mt: 2, mb: 1, fontSize: '0.9rem', color: 'text.secondary' }}
            >
              Tip: Click on text to select it, then drag the blue handle to resize or drag the text
              to reposition it.
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Quick Colors:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {colorOptions.map((color) => (
                <Box
                  key={color}
                  onClick={() => handleColorChange(color)}
                  sx={{
                    width: 30,
                    height: 30,
                    bgcolor: color,
                    border: textStyle.color === color ? '2px solid #8a4fff' : '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 2,
              border: '1px solid #ddd',
              borderRadius: 1,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                cursor: isResizing
                  ? 'nwse-resize'
                  : isDragging
                  ? 'grabbing'
                  : textSelected
                  ? 'grab'
                  : 'default',
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" component="label" sx={{ borderRadius: 4 }}>
              Change Image
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                bgcolor: '#8a4fff',
                '&:hover': { bgcolor: '#7a3fef' },
                borderRadius: 4,
              }}
            >
              Apply
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};
MemeCreator.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  inlineMode: PropTypes.bool,
};

export default MemeCreator;
