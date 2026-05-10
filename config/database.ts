import mongoose from 'mongoose';
const connect = async () => {
  try {
    await mongoose.connect(`${process.env.DATABASE}`);
    console.log("Kết nối thành công")
  } catch (error) {
    console.log("Kết nối thất bại", error)
  }
}
export { connect }