import { FC, useState } from "react";
import {
  Modal,
  Box,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  IconButton,
  Typography,
  Select,
  MenuItem,
  Radio,
  InputAdornment,
  FormControl,
  RadioGroup
} from "@mui/material";
import {
  Search,
  X,
  Calendar,
  Car,
  Tag,
  FileText,
  User,
  Package,
  Gavel,
  MapPin,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { performSearch } from "../components/extendedSearch/searchPerform";

interface ExtendedSearchProps {
  open: boolean;
  onClose: () => void;
  onSearchResults: (results: any[]) => void;
}

const ExtendedSearch: FC<ExtendedSearchProps> = ({ open, onClose, onSearchResults }) => {
  const [formData, setFormData] = useState({
    sl_dispnum: '',
    sl_licensest: 'CA',
    sl_licensenum: '',
    sl_vin: '',
    sl_towdate: '',
    sl_towtagnum: '',
    sl_refnumber: '',
    sl_invoicenum: '',
    sl_yearcar: '',
    sl_makecar: '',
    sl_modelcar: '',
    sl_colorcar: '',
    sl_ponumber: '',
    sl_driver: '',
    sl_stocknum: '',
    sl_auctnum: '',
    sl_releaselic: '',
    sl_towedfrom: '',
    powersearch_cb: 'Billing Screen Name',
    powersearch_txt: ''
  });

  const [filterValue, setFilterValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const powerSearchOptions = [
    'Billing Screen Name',
    'Notes',
    'Who Called',
    'License',
    'Vin',
    'Member#',
    'Towedfrom',
    'Towedto'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    const results = await performSearch({ formData, filterValue });
    onSearchResults(results);
    setLoading(false)
  };


  const handleReset = () => {
    setFormData({
      sl_dispnum: '',
      sl_licensest: 'CA',
      sl_licensenum: '',
      sl_vin: '',
      sl_towdate: '',
      sl_towtagnum: '',
      sl_refnumber: '',
      sl_invoicenum: '',
      sl_yearcar: '',
      sl_makecar: '',
      sl_modelcar: '',
      sl_colorcar: '',
      sl_ponumber: '',
      sl_driver: '',
      sl_stocknum: '',
      sl_auctnum: '',
      sl_releaselic: '',
      sl_towedfrom: '',
      powersearch_cb: 'Billing Screen Name',
      powersearch_txt: ''
    });
    setFilterValue('');
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '800px',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2" display="flex" alignItems="center">
            FoxTow Extended Search
          </Typography>
          <IconButton onClick={onClose}>
            <X size={24} />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* First Row */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Dispatch #"
                name="sl_dispnum"
                value={formData.sl_dispnum}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={6} sm={2}>
              <TextField
                fullWidth
                label="State"
                name="sl_licensest"
                value={formData.sl_licensest}
                onChange={handleChange}
                inputProps={{ maxLength: 2 }}
              />
            </Grid>

            <Grid item xs={6} sm={6}>
              <TextField
                fullWidth
                label="License #"
                name="sl_licensenum"
                value={formData.sl_licensenum}
                onChange={handleChange}
              />
            </Grid>

            {/* Second Row */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Last 4 Vin"
                name="sl_vin"
                value={formData.sl_vin}
                onChange={handleChange}
                inputProps={{ maxLength: 4 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Car size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Date Towed"
                name="sl_towdate"
                value={formData.sl_towdate}
                onChange={handleChange}
                placeholder="MM/DD/YY"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Calendar size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Tow Tag #"
                name="sl_towtagnum"
                value={formData.sl_towtagnum}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tag size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Third Row */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Ref #"
                name="sl_refnumber"
                value={formData.sl_refnumber}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Inv #"
                name="sl_invoicenum"
                value={formData.sl_invoicenum}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FileText size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="PO #"
                name="sl_ponumber"
                value={formData.sl_ponumber}
                onChange={handleChange}
              />
            </Grid>

            {/* Vehicle Details Row */}
            <Grid item xs={4} sm={2}>
              <TextField
                fullWidth
                label="Year"
                name="sl_yearcar"
                value={formData.sl_yearcar}
                onChange={handleChange}
                inputProps={{ maxLength: 2 }}
              />
            </Grid>

            <Grid item xs={8} sm={4}>
              <TextField
                fullWidth
                label="Make"
                name="sl_makecar"
                value={formData.sl_makecar}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Model"
                name="sl_modelcar"
                value={formData.sl_modelcar}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Color"
                name="sl_colorcar"
                value={formData.sl_colorcar}
                onChange={handleChange}
              />
            </Grid>

            {/* Additional Fields Row */}
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Driver #"
                name="sl_driver"
                value={formData.sl_driver}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Stock #"
                name="sl_stocknum"
                value={formData.sl_stocknum}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Package size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Rel Lic #"
                name="sl_releaselic"
                value={formData.sl_releaselic}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Gavel size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Towed From"
                name="sl_towedfrom"
                value={formData.sl_towedfrom}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MapPin size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Checkboxes Section */}
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  aria-label="search-filters"
                  name="searchFilters"
                  value={filterValue}
                  onChange={handleFilterChange}
                  sx={{ gap: 3 }}
                >
                  <FormControlLabel
                    value="transportOnly"
                    control={<Radio />}
                    label="Transport Only"
                  />
                  <FormControlLabel
                    value="storedCarsOnly"
                    control={<Radio />}
                    label="Stored Cars Only"
                  />
                  <FormControlLabel
                    value="checkHistory"
                    control={<Radio />}
                    label="Check History Only"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Power Search Row */}
            <Grid item xs={12} sm={5}>
              <Select
                fullWidth
                name="powersearch_cb"
                value={formData.powersearch_cb}
                onChange={handleSelectChange}
              >
                {powerSearchOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={7}>
              <TextField
                fullWidth
                label="Power Search"
                name="powersearch_txt"
                value={formData.powersearch_txt}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Buttons Row */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={handleReset}
                  startIcon={<X size={20} />}
                >
                  Reset
                </Button>
                <Box display="flex" gap={2}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<Search size={20} />}
                    disabled={loading}
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};

export default ExtendedSearch;