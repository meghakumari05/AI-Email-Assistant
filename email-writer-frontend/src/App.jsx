import './App.css'
import { Container, Typography, Box, TextField, CircularProgress } from '@mui/material';
import { useState } from 'react';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';


function App() {
 const[emailContent, setEmailContent  ] = useState('');
 const[tone, setTone  ] = useState('');
 const[generatedReply, setGeneratedReply] = useState('');
 const[loading, setLoading  ] = useState(false);


const handleSubmit = async () => {
const response = await fetch("https://ai-email-assistant-f4wh.onrender.com/api/email/generate", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        emailContent: emailContent
    })
});

console.log("Status:", response.status);

if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
}

const data = await response.text();

console.log("Response:", data);

setGeneratedReply(data);
};


  return (
    
      <Container maxWidth="md" sx={{py:4}}>
          <Typography variant="h3" component="h1" gutterBottom>
            Email Reply Generator
          </Typography>
          <Box sx = {{mx:3}}>
            <TextField 
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              label = "Original Email Content"
              value={emailContent || ''}
              onChange = {(e) => setEmailContent(e.target.value)}
              sx={{mb:2}}
            />

            <FormControl fullWidth sx={{mb:2}}>
    <InputLabel>Tone (Optional)</InputLabel>
  <Select
    value={tone || ''}
    label="Tone (Optional)"
    onChange={(e) => setTone(e.target.value)}
  >
    <MenuItem value="">None</MenuItem>
    <MenuItem value="professional">Professional</MenuItem>
    <MenuItem value="casual">Casual</MenuItem>
    <MenuItem value="friendly">Friendly</MenuItem>
  </Select>
</FormControl>
    <Button variant="contained" sx={{mb:2}} 
     onClick={handleSubmit}
    disabled ={!emailContent || loading}>
    {loading ? <CircularProgress size = {24}/> : "Generate Reply"}
    </Button>

          </Box>

           <Box sx = {{mx:3}}>
            <TextField 
              fullWidth
              multiline
              rows={6}
              variant="outlined"

              value={generatedReply || ''}
               slotProps={{
              htmlInput: {
              readOnly: true
        }
    }}
              sx={{mb:2}}
            />

            <Button variant="outlined" onClick={() => navigator.clipboard.writeText(generatedReply)}>
              Copy to Clipboard
            </Button>
            </Box>
      </Container>
  )
}

export default App
