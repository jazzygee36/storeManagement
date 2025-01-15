import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface ErrorPayload {
  message: string;
  statusCode: number;
}

interface StaffProduct {
  _id: string;
  productName: string;
  unitPrice: number;
  qtyRemaining: string;
  qtyBought: number;
  salesPrice: number;
  availability: string;
}

interface StaffProfileState {
  products: StaffProduct[];
  loading: boolean;
  error: string | null;
}

const initialState: StaffProfileState = {
  products: [],
  loading: false,
  error: null,
};

// Async thunk to fetch staff data
export const fetchStaffProducts = createAsyncThunk<
  StaffProduct[], // Success return type
  string, // Argument type
  { rejectValue: ErrorPayload } // Reject value type
>('staffProduct/fetchStaffProducts', async (staffId, { rejectWithValue }) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${staffId}/products`
    );
    return res.data; // Assuming the response contains the list of staff products
  } catch (error: unknown) {
    // Type guard to ensure error is an instance of AxiosError
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data || {
          message: 'Unknown error occurred',
          statusCode: 500,
        }
      );
    }
    return rejectWithValue({
      message: 'Unknown error occurred',
      statusCode: 500,
    });
  }
});

const staffProductSlice = createSlice({
  name: 'staffProduct',
  initialState,
  reducers: {
    staffProduct: (state, action: PayloadAction<StaffProduct>) => {
      state.products.push(action.payload); // Add the new staff to the existing array
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchStaffProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Unknown error occurred';
      });
  },
});

export const { staffProduct } = staffProductSlice.actions;

export default staffProductSlice.reducer;
