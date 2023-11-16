FROM python:3.8.10

# Set the working directory to /app
WORKDIR /app

# Install any needed packages specified in requirements.txt
COPY ./requirements.txt /app

RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app

# Run app.py when the container launches
CMD ["python3", "-u", "main.py"]