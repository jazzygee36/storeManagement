import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Sale {
  id: string;
  productId: string;
  sellingPrice: number;
  qtySold: number;
  totalPrice: number;
  paymentMethod: string;
  productName?: string;
  grandTotal?: number;
  date?: string; // Add the date as an optional field
}

// New type to reflect the structure of sales grouped by date
interface GroupedSales {
  [date: string]: {
    sales: Sale[];
    grandTotal: number;
  };
}

// Define the initial state
interface SalesState {
  sales: GroupedSales;
  loading: boolean;
  error: string | null;
}

const initialState: SalesState = {
  sales: {},
  loading: false,
  error: null,
};

export const fetchSales = createAsyncThunk(
  'sales/fetchSales',
  async (staffId: string, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/daily-sales-report/${staffId}`
      );
      console.log('Fetched sales data:', response.data?.salesByDate);
      return response.data?.salesByDate; // Grouped by date
    } catch (error: any) {
      console.error('Error fetching sales:', error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch sales'
      );
    }
  }
);

// Async thunk for adding a new sale
export const addSale = createAsyncThunk(
  'sales/addSale',
  async (
    {
      sales,
      staffId,
    }: { sales: Omit<Sale, 'id' | 'paymentMethod'>[]; staffId: string },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/${staffId}/daily-sales`,
        sales
      );
      return response.data; // Assuming the backend returns the added sale
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to add sale'
      );
    }
  }
);

// Create the sales slice
const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchSales
    builder.addCase(fetchSales.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchSales.fulfilled,
      (state, action: PayloadAction<GroupedSales>) => {
        state.loading = false;
        state.sales = action.payload; // Update with grouped sales
      }
    );
    builder.addCase(
      fetchSales.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      }
    );

    // Handle addSale
    builder.addCase(addSale.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      addSale.fulfilled,
      (state, action: PayloadAction<Sale[]>) => {
        state.loading = false;
        // Assuming the sale data is returned as an array of sales
        action.payload.forEach((sale) => {
          const saleDate = sale.date || 'Unknown Date'; // Handle if no date is provided
          if (!state.sales[saleDate]) {
            state.sales[saleDate] = { sales: [], grandTotal: 0 };
          }
          state.sales[saleDate].sales.push(sale);
          state.sales[saleDate].grandTotal += sale.totalPrice; // Update grand total
        });
      }
    );
    builder.addCase(addSale.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { resetError } = salesSlice.actions;

export default salesSlice.reducer;
