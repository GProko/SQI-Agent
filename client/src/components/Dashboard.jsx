import React, { useState } from 'react';
import axios from 'axios';
import { 
  Grid, Paper, Typography, TextField, Button, Box, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress,
  Card, CardContent, CardHeader, IconButton, Tooltip
} from '@mui/material';
import { 
  PlayArrow as PlayArrowIcon,
  ContentCopy as ContentCopyIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorOutlineIcon,
  Science as ScienceIcon,
  Code as CodeIcon,
  Save as SaveIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const [prompt, setPrompt] = useState('Generate a 20-question diagnostic covering most topics...');
  const [jsonInput, setJsonInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

 
  const handleCompute = async () => {
    if(!jsonInput) return alert("Please enter JSON data first");
    setLoading(true);
    try {
      let parsedData;
      try {
        parsedData = JSON.parse(jsonInput);
      } catch (e) {
        alert("Invalid JSON format.");
        setLoading(false);
        return;
      }
      const response = await axios.post('http://localhost:5000/api/compute-sqi', {
        student_id: parsedData.student_id,
        attempts: parsedData.attempts,
        diagnostic_prompt: prompt
      });
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Error computing SQI. Ensure backend is running.");
    }
    setLoading(false);
  };


  const handleCopyJson = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

 
  const handleDownloadJson = () => {
    if (result) {
      const jsonString = JSON.stringify(result, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = `sqi_result_${result.student_id || 'unknown'}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

 
  const handleSavePrompt = () => {
    
    alert("Prompt saved locally!"); 
    localStorage.setItem('saved_diagnostic_prompt', prompt);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#2e7d32'; 
    if (score >= 50) return '#ed6c02'; 
    return '#d32f2f';
  };

  return (
    <Box sx={{ pb: 5 }}>
      
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <ScienceIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
            Diagnostic Engine
          </Typography>
          <Typography variant="body2" color="text.secondary">
            v1.0 • SQI Computation & Ranking System
          </Typography>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        
   
        <Grid item xs={12} md={4}>
          
          
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', mb: 3 }}>
            <CardHeader 
              title={<Typography variant="subtitle1" fontWeight="bold">1. Diagnostic Prompt</Typography>} 
              sx={{ bgcolor: '#fafafa', py: 1.5, borderBottom: '1px solid #eee' }}
            />
            <CardContent sx={{ p: 2 }}>
              <TextField
                fullWidth multiline rows={3} variant="outlined"
                value={prompt} onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter prompt instructions..."
                sx={{ fontSize: '0.9rem', mb: 2 }}
              />
              <Button 
                variant="outlined" size="small" startIcon={<SaveIcon />} 
                onClick={handleSavePrompt}
              >
                Save Prompt
              </Button>
            </CardContent>
          </Card>

          
          <Card elevation={0} sx={{ border: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', height: 'calc(100% - 250px)' }}>
             <CardHeader 
              title={<Typography variant="subtitle1" fontWeight="bold">2. Student Data (JSON)</Typography>} 
              sx={{ bgcolor: '#fafafa', py: 1.5, borderBottom: '1px solid #eee' }}
            />
            <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <TextField
                fullWidth multiline rows={15}
                variant="outlined"
                placeholder='Paste JSON here...'
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                sx={{ 
                  fontFamily: 'monospace', mb: 2, bgcolor: '#f8f9fa',
                  '& .MuiInputBase-input': { fontFamily: 'Consolas, Monaco, monospace', fontSize: '0.8rem' }
                }}
              />
            
              <Button 
                variant="contained" fullWidth size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <PlayArrowIcon />}
                onClick={handleCompute} disabled={loading}
                sx={{ mt: 'auto', py: 1.5, fontWeight: 'bold', boxShadow: 2 }}
              >
                {loading ? 'Computing...' : 'COMPUTE SQI'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

       
        <Grid item xs={12} md={8}>
          {result ? (
            <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
              <style>{`@keyframes fadeIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }`}</style>
              
             
              <Paper elevation={0} sx={{ 
                p: 3, mb: 3, 
                background: `linear-gradient(135deg, #eef2ff 0%, #fff 100%)`, 
                border: '1px solid #c7d2fe',
                borderRadius: 2,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <Box>
                   <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>STUDENT ID</Typography>
                   <Typography variant="h5" fontWeight="bold" color="#1a202c">{result.student_id}</Typography>
                   <Chip label={`Engine: ${result.metadata.engine}`} size="small" sx={{ mt: 1, bgcolor: '#fff', border: '1px solid #ddd' }} />
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                   <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 'bold' }}>OVERALL SQI</Typography>
                   <Typography variant="h2" sx={{ fontWeight: 800, color: getScoreColor(result.overall_sqi), lineHeight: 1 }}>
                     {result.overall_sqi}
                   </Typography>
                   <Typography variant="caption" color="text.secondary">/ 100 Points</Typography>
                </Box>
              </Paper>

           
              <Card elevation={3} sx={{ mb: 3, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <CardHeader 
                  title="Ranked Concepts" 
                  subheader="Priority list for Summary Customizer Agent"
                  avatar={<ErrorOutlineIcon color="action" />}
                  sx={{ borderBottom: '1px solid #f0f0f0' }}
                />
                <TableContainer>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#f9fafb' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>CONCEPT</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#666' }}>WEIGHT</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#666' }}>REASONS</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {result.ranked_concepts_for_summary.map((item, idx) => (
                        <TableRow key={idx} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="700" color="primary.main">{item.topic}</Typography>
                            <Typography variant="caption" color="text.secondary">{item.concept}</Typography>
                          </TableCell>
                          <TableCell align="right">
                             <Chip 
                                label={item.weight.toFixed(2)} size="small" 
                                sx={{ 
                                  fontWeight: 'bold',
                                  bgcolor: item.weight > 0.7 ? '#ffebee' : '#f5f5f5',
                                  color: item.weight > 0.7 ? '#c62828' : '#616161',
                                  border: item.weight > 0.7 ? '1px solid #ffcdd2' : '1px solid #e0e0e0'
                                }} 
                             />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {item.reasons.length > 0 ? item.reasons.map((r, i) => (
                                <Chip key={i} label={r} size="small" variant="outlined" sx={{ fontSize: '0.7rem', borderColor: '#ddd' }} />
                              )) : <Typography variant="caption" color="text.disabled">-</Typography>}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>

            
              <Card elevation={0} sx={{ bgcolor: '#fff', color: '#000', borderRadius: 2, border: '1px solid #ddd' }}>
                <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', bgcolor: '#fafafa' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CodeIcon sx={{ fontSize: 18, color: '#666' }} />
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#666' }}>PAYLOAD FOR NEXT AGENT</Typography>
                  </Box>
                  <Box>
                  
                    <Tooltip title="Download JSON">
                      <IconButton size="small" onClick={handleDownloadJson} sx={{ mr: 1 }}>
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                 
                    <Tooltip title={copySuccess ? "Copied!" : "Copy to Clipboard"}>
                      <IconButton size="small" onClick={handleCopyJson} sx={{ color: copySuccess ? '#4caf50' : '#666' }}>
                        {copySuccess ? <CheckCircleIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Box 
                  component="pre" 
                  sx={{ 
                    m: 0, p: 2,
                    overflowX: 'auto', 
                    fontSize: '0.75rem', 
                    fontFamily: '"Fira Code", Consolas, Monaco, monospace',
                    lineHeight: 1.5,
                    color: '#333'
                  }}
                >
                  {JSON.stringify(result, null, 2)}
                </Box>
              </Card>

            </Box>
          ) : (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 8, textAlign: 'center', color: 'text.secondary', 
                bgcolor: '#f8f9fa', border: '2px dashed #e0e0e0', borderRadius: 3,
                height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
              }}
            >
              <ScienceIcon sx={{ fontSize: 80, color: '#e0e0e0', mb: 2 }} />
              <Typography variant="h6" color="text.primary" gutterBottom>Compute</Typography>
              <Typography variant="body2" sx={{ maxWidth: 300, mx: 'auto' }}>
                Paste the student attempt JSON data.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;