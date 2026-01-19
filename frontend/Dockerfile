# Sử dụng Node.js image
FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source code
COPY . .

# Build ứng dụng React
RUN npm run build

# Cài đặt serve để chạy static files
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Chạy ứng dụng
CMD ["serve", "-s", "build", "-l", "3000"]