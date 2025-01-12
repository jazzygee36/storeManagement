// reducers/productSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ErrorResponse {
  message: string;
  statusCode: number;
}

interface DeleteProductResponse {
  productId: string;
  message: string;
}

interface ProductState {
  selectedProductId: string | null;
  products: Array<{ id: string; name: string }>; // Example type
}

const initialState: ProductState = {
  selectedProductId: null,
  products: [],
};

// Async action to delete a product
export const deleteProduct = createAsyncThunk<
  DeleteProductResponse,
  string,
  { rejectValue: ErrorResponse }
>('products/deleteProduct', async (productId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${productId}/delete/product`
    );
    return { productId, message: response.data.message };
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

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSelectedProductId(state, action: PayloadAction<string | null>) {
      state.selectedProductId = action.payload;
    },
  },
});

export const { setSelectedProductId } = productSlice.actions;

export default productSlice.reducer;
