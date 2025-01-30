import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ErrorPayload {
  message: string;
  statusCode: number;
}

interface ProductUpdatePayload {
  productId: string;
  productData: {
    productName: string;
    unitPrice: number;
    qtyBought: number;
    salesPrice: number;

    qtyRemaining?: number;
    // availability?: number;
    exp?: string;
  };
}

interface ProductUpdateState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

const initialState: ProductUpdateState = {
  loading: false,
  success: false,
  error: null,
};

// Async thunk to update product details
export const updateProduct = createAsyncThunk<
  void, // Success return type
  ProductUpdatePayload, // Argument type
  { rejectValue: ErrorPayload } // Reject value type
>('productUpdate/updateProduct', async (payload, { rejectWithValue }) => {
  const { productId, productData } = payload;
  try {
    await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${productId}/update/product`,
      productData
    );
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data || {
          message: 'Failed to update product',
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

const productUpdateSlice = createSlice({
  name: 'productUpdate',
  initialState,
  reducers: {
    resetUpdateState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || 'Failed to update product';
      });
  },
});

export const { resetUpdateState } = productUpdateSlice.actions;

export default productUpdateSlice.reducer;
