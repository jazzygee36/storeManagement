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

// Define a type for Axios errors
interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const fetchSales = createAsyncThunk(
  'sales/fetchSales',
  async (staffId: string, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/daily-sales-report/${staffId}`
      );
      return response.data?.salesByDate as GroupedSales; // Grouped by date
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      return thunkAPI.rejectWithValue(
        axiosError.response?.data?.message || 'Failed to fetch sales'
      );
    }
  }
);

export const addSale = createAsyncThunk(
  'sales/addSale',
  async (
    {
      sales,
      staffId,
      showToast,
    }: {
      sales: Omit<Sale, 'id' | 'paymentMethod'>[];
      staffId: string;
      showToast: () => void;
    },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/${staffId}/daily-sales`,
        sales
      );

      // Show a success toast
      showToast();

      // Ensure the response is always normalized as an array
      return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error: unknown) {
      const axiosError = error as AxiosError;

      return thunkAPI.rejectWithValue(
        axiosError.response?.data?.message || 'Failed to add sale'
      );
    }
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSales.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchSales.fulfilled,
      (state, action: PayloadAction<GroupedSales>) => {
        state.loading = false;
        state.sales = action.payload;
      }
    );
    builder.addCase(fetchSales.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Unknown error';
    });

    builder.addCase(addSale.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      addSale.fulfilled,
      (state, action: PayloadAction<Sale[]>) => {
        state.loading = false;

        // Ensure action.payload is processed as an array
        action.payload.forEach((sale) => {
          const saleDate = sale.date || 'Unknown Date';
          if (!state.sales[saleDate]) {
            state.sales[saleDate] = { sales: [], grandTotal: 0 };
          }
          state.sales[saleDate].sales.push(sale);
          state.sales[saleDate].grandTotal += sale.totalPrice;
        });
      }
    );
    builder.addCase(addSale.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Unknown error';
    });
  },
});

export const { resetError } = salesSlice.actions;

export default salesSlice.reducer;
