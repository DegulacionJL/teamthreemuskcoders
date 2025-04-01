'use client';

import { useEffect, useRef, useState } from 'react';
import { Image as KonvaImage, Layer, Line, Stage, Text } from 'react-konva';
import { Brush, Check, Delete, PanTool, TextFields, Undo } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, Paper, Slider, TextField, Typography } from '@mui/material';

function ImageEditor({ imageUrl, onSave, onCancel }) {
  const [tool, setTool] = useState('select');
  const [lines, setLines] = useState([]);
  const [texts, setTexts] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(24);
  const [drawColor, setDrawColor] = useState('#ff0000');
  const [drawSize, setDrawSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [image, setImage] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const stageRef = useRef(null);

  // Load the image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      setImage(img);
    };
  }, [imageUrl]);

  const handleMouseDown = (e) => {
    if (tool === 'draw') {
      setIsDrawing(true);
      const pos = e.target.getStage().getPointerPosition();
      setLines([...lines, { points: [pos.x, pos.y], color: drawColor, strokeWidth: drawSize }]);
    } else if (tool === 'text') {
      const stage = e.target.getStage();
      const pos = stage.getPointerPosition();

      const newText = {
        id: Date.now().toString(),
        x: pos.x,
        y: pos.y,
        text: currentText || 'Double click to edit',
        fontSize,
        fill: textColor,
        draggable: true,
      };

      setTexts([...texts, newText]);
      setCurrentText('');
      setTool('select'); // Switch to select after adding text
    } else if (tool === 'select') {
      // Deselect when clicking on empty area
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        setSelectedId(null);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || tool !== 'draw') return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];

    // Add point to the last line
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // Replace the last line
    lines.splice(lines.length - 1, 1, lastLine);
    setLines([...lines]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTextDblClick = (e, textId) => {
    if (tool !== 'select') return;

    const textNode = texts.find((t) => t.id === textId);
    if (!textNode) return;

    // Create a temporary input field
    const textPosition = e.target.absolutePosition();
    const stageBox = stageRef.current.container().getBoundingClientRect();

    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    };

    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    textarea.value = textNode.text;
    textarea.style.position = 'absolute';
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.width = `${textNode.fontSize * textNode.text.length * 0.6}px`;
    textarea.style.height = `${textNode.fontSize * 1.5}px`;
    textarea.style.fontSize = `${textNode.fontSize}px`;
    textarea.style.border = 'none';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.color = textNode.fill;
    textarea.style.lineHeight = `${textNode.fontSize * 1.2}px`;
    textarea.style.fontFamily = 'sans-serif';
    textarea.style.zIndex = '1000';

    textarea.focus();

    textarea.addEventListener('keydown', (e) => {
      // Enter = save, Escape = cancel
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        textarea.blur();
      }
      if (e.key === 'Escape') {
        textarea.blur();
      }
    });

    textarea.addEventListener('blur', () => {
      const newText = textarea.value;
      document.body.removeChild(textarea);

      // Update the text
      const updatedTexts = texts.map((t) => (t.id === textId ? { ...t, text: newText } : t));
      setTexts(updatedTexts);
    });
  };

  const handleSave = () => {
    if (!stageRef.current) return;

    const dataUrl = stageRef.current.toDataURL();
    onSave(dataUrl);
  };

  const handleClear = () => {
    setLines([]);
    setTexts([]);
  };

  const handleTextSelect = (textId) => {
    setSelectedId(textId);
  };

  const handleDeleteSelected = () => {
    if (!selectedId) return;

    setTexts(texts.filter((t) => t.id !== selectedId));
    setSelectedId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      handleDeleteSelected();
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item>
          <Paper elevation={0} sx={{ display: 'flex', p: 0.5, bgcolor: 'background.default' }}>
            <IconButton
              color={tool === 'select' ? 'primary' : 'default'}
              onClick={() => setTool('select')}
            >
              <PanTool fontSize="small" />
            </IconButton>
            <IconButton
              color={tool === 'text' ? 'primary' : 'default'}
              onClick={() => setTool('text')}
            >
              <TextFields fontSize="small" />
            </IconButton>
            <IconButton
              color={tool === 'draw' ? 'primary' : 'default'}
              onClick={() => setTool('draw')}
            >
              <Brush fontSize="small" />
            </IconButton>
          </Paper>
        </Grid>

        <Grid item sx={{ ml: 'auto' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={handleClear}>
              <Undo fontSize="small" />
            </IconButton>
            {selectedId && (
              <IconButton color="error" onClick={handleDeleteSelected}>
                <Delete fontSize="small" />
              </IconButton>
            )}
            <Button
              variant="contained"
              color="primary"
              startIcon={<Check />}
              onClick={handleSave}
              sx={{ ml: 1 }}
            >
              Save
            </Button>
          </Box>
        </Grid>
      </Grid>

      {tool === 'text' && (
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Enter text"
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                placeholder="Click on image to add text"
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Color:
                </Typography>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  style={{ width: '30px', height: '30px' }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 1, whiteSpace: 'nowrap' }}>
                  Size: {fontSize}px
                </Typography>
                <Slider
                  value={fontSize}
                  min={12}
                  max={72}
                  step={1}
                  onChange={(_, value) => setFontSize(value)}
                  sx={{ ml: 1 }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      {tool === 'draw' && (
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6} sm={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Color:
                </Typography>
                <input
                  type="color"
                  value={drawColor}
                  onChange={(e) => setDrawColor(e.target.value)}
                  style={{ width: '30px', height: '30px' }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} sm={9}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 1, whiteSpace: 'nowrap' }}>
                  Size: {drawSize}px
                </Typography>
                <Slider
                  value={drawSize}
                  min={1}
                  max={20}
                  step={1}
                  onChange={(_, value) => setDrawSize(value)}
                  sx={{ ml: 1 }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          bgcolor: '#f0f0f0',
        }}
      >
        {image && (
          <Stage
            width={Math.min(image.width, 800)}
            height={Math.min(image.height, 600)}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            ref={stageRef}
            style={{ backgroundColor: '#f0f0f0' }}
          >
            <Layer>
              <KonvaImage
                image={image}
                width={Math.min(image.width, 800)}
                height={Math.min(image.height, 600)}
              />

              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.color}
                  strokeWidth={line.strokeWidth}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                />
              ))}

              {texts.map((text) => (
                <Text
                  key={text.id}
                  id={text.id}
                  x={text.x}
                  y={text.y}
                  text={text.text}
                  fontSize={text.fontSize}
                  fill={text.fill}
                  draggable={true}
                  onClick={() => handleTextSelect(text.id)}
                  onDblClick={(e) => handleTextDblClick(e, text.id)}
                  onTap={() => handleTextSelect(text.id)}
                  onDblTap={(e) => handleTextDblClick(e, text.id)}
                  stroke={selectedId === text.id ? '#0096FF' : undefined}
                  strokeWidth={selectedId === text.id ? 1 : undefined}
                  shadowColor={selectedId === text.id ? 'black' : undefined}
                  shadowBlur={selectedId === text.id ? 5 : undefined}
                  shadowOpacity={selectedId === text.id ? 0.3 : undefined}
                />
              ))}
            </Layer>
          </Stage>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Image
        </Button>
      </Box>
    </Box>
  );
}

export default ImageEditor;
