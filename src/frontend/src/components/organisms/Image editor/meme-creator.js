import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import {
  Add,
  Close,
  ColorLens,
  Delete,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  TextFields,
} from '@mui/icons-material';
import { Box, Button, IconButton, Paper, Slider, TextField, Typography } from '@mui/material';

const MemeCreator = ({ onSave, onCancel, inlineMode = false }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [textBlocks, setTextBlocks] = useState([]);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 500 });

  // Predefined colors for text
  const colorOptions = [
    '#ffffff', // white
    '#000000', // black
    '#ff0000', // red
    '#00ffff', // cyan
    '#ffff00', // yellow
    '#ff00ff', // magenta
    '#00ff00', // green
    '#0000ff', // blue
    '#ffa500', // orange
    '#800080', // purple
  ];

  // Get the currently selected text block
  const selectedBlock = textBlocks.find((block) => block.id === selectedBlockId);

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

  // Add a new text block
  const addTextBlock = () => {
    const newBlockId = `text-${Date.now()}`;
    const newBlock = {
      id: newBlockId,
      text: 'New Text',
      position: { x: canvasSize.width / 2, y: canvasSize.height / 2 },
      style: {
        fontSize: 30,
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        color: '#ffffff',
        stroke: '#000000',
        strokeWidth: 1,
        lineHeight: 1.5,
      },
      bounds: { width: 0, height: 0 },
    };

    setTextBlocks([...textBlocks, newBlock]);
    setSelectedBlockId(newBlockId);
  };

  // Delete the selected text block
  const deleteSelectedBlock = () => {
    if (selectedBlockId) {
      setTextBlocks(textBlocks.filter((block) => block.id !== selectedBlockId));
      setSelectedBlockId(null);
    }
  };

  // Calculate text bounds for multiline text
  const calculateTextBounds = (ctx, text, fontSize, lineHeight) => {
    const lines = text.split('\n');
    const lineHeightPx = fontSize * lineHeight;

    let maxWidth = 0;
    const totalHeight = lineHeightPx * lines.length;

    lines.forEach((line) => {
      const metrics = ctx.measureText(line);
      const lineWidth = metrics.width;
      maxWidth = Math.max(maxWidth, lineWidth);
    });

    return { width: maxWidth, height: totalHeight };
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

    // Draw all text blocks
    textBlocks.forEach((block) => {
      const { id, text, position, style } = block;

      ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize}px Arial`;
      ctx.fillStyle = style.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // Split text into lines
      const lines = text.split('\n');
      const lineHeight = style.fontSize * style.lineHeight;

      // Calculate text bounds for all lines
      const bounds = calculateTextBounds(ctx, text, style.fontSize, style.lineHeight);

      // Update the block's bounds in state (for future reference)
      if (JSON.stringify(bounds) !== JSON.stringify(block.bounds)) {
        setTextBlocks((prevBlocks) => prevBlocks.map((b) => (b.id === id ? { ...b, bounds } : b)));
      }

      // Calculate starting Y position
      const startY = position.y - bounds.height / 2;

      // Draw each line
      lines.forEach((line, index) => {
        const lineY = startY + index * lineHeight;

        // Add stroke (outline)
        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = style.strokeWidth;
        ctx.strokeText(line, position.x, lineY);

        // Fill text
        ctx.fillText(line, position.x, lineY);

        // Add underline if needed
        if (style.textDecoration === 'underline') {
          const lineWidth = ctx.measureText(line).width;
          ctx.beginPath();
          ctx.moveTo(position.x - lineWidth / 2, lineY + style.fontSize + 2);
          ctx.lineTo(position.x + lineWidth / 2, lineY + style.fontSize + 2);
          ctx.strokeStyle = style.color;
          ctx.stroke();
        }
      });

      // Draw selection box if this text block is selected
      if (id === selectedBlockId) {
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);

        // Draw bounding box
        ctx.strokeRect(
          position.x - bounds.width / 2 - 10,
          startY - 10,
          bounds.width + 20,
          bounds.height + 20
        );

        // Draw resize handle
        ctx.fillStyle = '#4a90e2';
        ctx.fillRect(position.x + bounds.width / 2 + 5, startY + bounds.height / 2, 10, 10);

        ctx.setLineDash([]);
      }
    });
  }, [image, textBlocks, selectedBlockId]);

  // Handle mouse events for selecting, dragging and resizing text
  const handleMouseDown = (e) => {
    if (textBlocks.length === 0) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // First check if we're clicking on a resize handle of the selected block
    if (selectedBlockId) {
      const selectedBlock = textBlocks.find((block) => block.id === selectedBlockId);
      const { position, bounds } = selectedBlock;
      const startY = position.y - bounds.height / 2;

      // Check if click is on resize handle
      const resizeHandleX = position.x + bounds.width / 2 + 5;
      const resizeHandleY = startY + bounds.height / 2;

      if (
        x >= resizeHandleX &&
        x <= resizeHandleX + 10 &&
        y >= resizeHandleY &&
        y <= resizeHandleY + 10
      ) {
        setIsResizing(true);
        setDragStart({ x, y });
        return;
      }
    }

    // Check if we're clicking on any text block (for selection or dragging)
    let clickedOnBlock = false;

    for (let i = textBlocks.length - 1; i >= 0; i--) {
      const block = textBlocks[i];
      const { position, bounds } = block;
      const startY = position.y - bounds.height / 2;

      if (
        x >= position.x - bounds.width / 2 - 10 &&
        x <= position.x + bounds.width / 2 + 10 &&
        y >= startY - 10 &&
        y <= startY + bounds.height + 10
      ) {
        // We found a block that was clicked
        setSelectedBlockId(block.id);

        // If it's already selected, start dragging
        if (block.id === selectedBlockId) {
          setIsDragging(true);
          setDragStart({ x, y });
        }

        clickedOnBlock = true;
        break;
      }
    }

    // If we didn't click on any block, deselect current block
    if (!clickedOnBlock) {
      setSelectedBlockId(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging && !isResizing) return;
    if (!selectedBlockId) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging) {
      // Move the selected text block
      const dx = x - dragStart.x;
      const dy = y - dragStart.y;

      setTextBlocks(
        textBlocks.map((block) => {
          if (block.id === selectedBlockId) {
            return {
              ...block,
              position: {
                x: block.position.x + dx,
                y: block.position.y + dy,
              },
            };
          }
          return block;
        })
      );

      setDragStart({ x, y });
    } else if (isResizing) {
      // Resize the font of the selected text block
      const dx = x - dragStart.x;

      setTextBlocks(
        textBlocks.map((block) => {
          if (block.id === selectedBlockId) {
            const newSize = Math.max(10, block.style.fontSize + dx / 2);
            return {
              ...block,
              style: {
                ...block.style,
                fontSize: newSize,
              },
            };
          }
          return block;
        })
      );

      setDragStart({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  // Handle text content changes
  const handleTextChange = (e) => {
    if (!selectedBlockId) return;

    setTextBlocks(
      textBlocks.map((block) => {
        if (block.id === selectedBlockId) {
          return {
            ...block,
            text: e.target.value,
          };
        }
        return block;
      })
    );
  };

  // Handle text style changes
  const toggleBold = () => {
    if (!selectedBlockId) return;

    setTextBlocks(
      textBlocks.map((block) => {
        if (block.id === selectedBlockId) {
          return {
            ...block,
            style: {
              ...block.style,
              fontWeight: block.style.fontWeight === 'bold' ? 'normal' : 'bold',
            },
          };
        }
        return block;
      })
    );
  };

  const toggleItalic = () => {
    if (!selectedBlockId) return;

    setTextBlocks(
      textBlocks.map((block) => {
        if (block.id === selectedBlockId) {
          return {
            ...block,
            style: {
              ...block.style,
              fontStyle: block.style.fontStyle === 'italic' ? 'normal' : 'italic',
            },
          };
        }
        return block;
      })
    );
  };

  const toggleUnderline = () => {
    if (!selectedBlockId) return;

    setTextBlocks(
      textBlocks.map((block) => {
        if (block.id === selectedBlockId) {
          return {
            ...block,
            style: {
              ...block.style,
              textDecoration: block.style.textDecoration === 'underline' ? 'none' : 'underline',
            },
          };
        }
        return block;
      })
    );
  };

  const handleFontSizeChange = (event, newValue) => {
    if (!selectedBlockId) return;

    setTextBlocks(
      textBlocks.map((block) => {
        if (block.id === selectedBlockId) {
          return {
            ...block,
            style: {
              ...block.style,
              fontSize: newValue,
            },
          };
        }
        return block;
      })
    );
  };

  const handleLineHeightChange = (event, newValue) => {
    if (!selectedBlockId) return;

    setTextBlocks(
      textBlocks.map((block) => {
        if (block.id === selectedBlockId) {
          return {
            ...block,
            style: {
              ...block.style,
              lineHeight: newValue,
            },
          };
        }
        return block;
      })
    );
  };

  const handleColorChange = (color) => {
    if (!selectedBlockId) return;

    setTextBlocks(
      textBlocks.map((block) => {
        if (block.id === selectedBlockId) {
          return {
            ...block,
            style: {
              ...block.style,
              color: color,
            },
          };
        }
        return block;
      })
    );
  };

  // Save the meme
  const handleSave = () => {
    if (!canvasRef.current) return;

    // Temporarily hide selection box for saving
    const originalSelectedId = selectedBlockId;
    setSelectedBlockId(null);

    // Use setTimeout to ensure the canvas is redrawn without selection box
    setTimeout(() => {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onSave(dataUrl, caption);

      // Restore selection state
      setSelectedBlockId(originalSelectedId);
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
              multiline
              rows={2}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              bgcolor: 'rgba(138, 79, 255, 0.05)',
              p: 1,
              borderRadius: 1,
            }}
          >
            <Typography variant="subtitle1">Text Blocks: {textBlocks.length}</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={addTextBlock}
              sx={{
                bgcolor: '#8a4fff',
                '&:hover': { bgcolor: '#7a3fef' },
                borderRadius: 4,
              }}
            >
              Add Text Block
            </Button>
          </Box>

          {selectedBlockId && (
            <>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Text Content"
                  variant="outlined"
                  value={selectedBlock.text}
                  onChange={handleTextChange}
                  multiline
                  rows={3}
                  placeholder="Enter your text here"
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex' }}>
                  <IconButton
                    onClick={toggleBold}
                    color={selectedBlock.style.fontWeight === 'bold' ? 'primary' : 'default'}
                  >
                    <FormatBold />
                  </IconButton>
                  <IconButton
                    onClick={toggleItalic}
                    color={selectedBlock.style.fontStyle === 'italic' ? 'primary' : 'default'}
                  >
                    <FormatItalic />
                  </IconButton>
                  <IconButton
                    onClick={toggleUnderline}
                    color={
                      selectedBlock.style.textDecoration === 'underline' ? 'primary' : 'default'
                    }
                  >
                    <FormatUnderlined />
                  </IconButton>
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                    <ColorLens sx={{ color: selectedBlock.style.color, mr: 1 }} />
                    <input
                      type="color"
                      value={selectedBlock.style.color}
                      onChange={(e) => handleColorChange(e.target.value)}
                      style={{ width: '30px', height: '30px', cursor: 'pointer' }}
                    />
                  </Box>
                </Box>
                <IconButton
                  onClick={deleteSelectedBlock}
                  color="error"
                  sx={{ border: '1px solid rgba(255, 0, 0, 0.3)' }}
                >
                  <Delete />
                </IconButton>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Font Size: {Math.round(selectedBlock.style.fontSize)}px
                </Typography>
                <Slider
                  value={selectedBlock.style.fontSize}
                  min={10}
                  max={100}
                  step={1}
                  onChange={handleFontSizeChange}
                  aria-labelledby="font-size-slider"
                  sx={{ color: '#8a4fff' }}
                />

                <Typography variant="body2" sx={{ mb: 1, mt: 2 }}>
                  Line Spacing: {selectedBlock.style.lineHeight.toFixed(1)}
                </Typography>
                <Slider
                  value={selectedBlock.style.lineHeight}
                  min={0.8}
                  max={3}
                  step={0.1}
                  onChange={handleLineHeightChange}
                  aria-labelledby="line-height-slider"
                  sx={{ color: '#8a4fff' }}
                />
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
                        border:
                          selectedBlock.style.color === color
                            ? '2px solid #8a4fff'
                            : '1px solid #ccc',
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
            </>
          )}

          {!selectedBlockId && textBlocks.length > 0 && (
            <Box sx={{ mb: 2, p: 2, borderRadius: 1, bgcolor: 'rgba(138, 79, 255, 0.05)' }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                Click on a text block to edit its properties.
              </Typography>
            </Box>
          )}

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
                  : selectedBlockId
                  ? 'grab'
                  : 'default',
              }}
            />
          </Box>

          <Typography
            variant="body2"
            sx={{ mt: 1, mb: 2, fontSize: '0.9rem', color: 'text.secondary' }}
          >
            Tip: Click on text to select it, then drag the blue handle to resize or drag the text to
            reposition it. Press Enter for new lines.
          </Typography>

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
