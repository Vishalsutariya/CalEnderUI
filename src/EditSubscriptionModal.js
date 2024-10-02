// src/EditSubscriptionModal.js
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@mui/material';

const categories = ['Investment', 'Entertainment', 'Rent', 'Software', 'Other'];
const currencies = ['USD', 'INR', 'EUR', 'Other'];

const EditSubscriptionModal = ({ open, onClose, onSave, subscription }) => {
  const [formData, setFormData] = useState({ ...subscription });

  useEffect(() => {
    setFormData({ ...subscription });
  }, [subscription]);

  const handleChange = e => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const updatedSubscription = {
      ...formData,
      endDate: formData.ongoing ? null : formData.endDate,
    };
    onSave(updatedSubscription);
  };

  if (!formData) return null;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="edit-subscription-modal">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400 },
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Edit Subscription
        </Typography>
        <TextField
          label="Subscription Name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          select
          label="Category"
          name="category"
          value={formData.category || ''}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        >
          {categories.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          fullWidth
          multiline
          rows={2}
          sx={{ mb: 2 }}
        />
        <TextField
            select
            label="Frequency"
            name="frequency"
            value={formData.frequency || 'monthly'}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
        >
            <MenuItem value="one-time">One-time</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
        {/* Add more frequencies if needed */}
        </TextField>
        <TextField
          label="Start Date"
          name="startDate"
          type="date"
          value={formData.startDate ? formData.startDate.slice(0, 10) : ''}
          onChange={handleChange}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.ongoing}
              onChange={handleChange}
              name="ongoing"
            />
          }
          label="Ongoing Subscription"
        />
        {!formData.ongoing && (
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate ? formData.endDate.slice(0, 10) : ''}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
        )}
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={formData.amount || ''}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          select
          label="Currency"
          name="currency"
          value={formData.currency || ''}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        >
          {currencies.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditSubscriptionModal;
