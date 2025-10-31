import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ThunkConfig } from "@/app/providers/StoreProvider";
import { ValidateProfileError } from "@/features/EditableProfileCard/model/consts/consts";

export const updateProfilePhoto = createAsyncThunk<string, FormData, ThunkConfig<ValidateProfileError[]>>(
	"profile/updateProfilePhoto",
	async (photoData, thunkApi) => {
		const { extra, rejectWithValue } = thunkApi;

		try {
			const response = await extra.api.post("/profile/api/v1/profile/photo", photoData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (!response.data) {
				throw new Error();
			}

			return response.data.data;
		} catch (e) {
			console.log(e);
			return rejectWithValue([ValidateProfileError.SERVER_ERROR]);
		}
	}
);
