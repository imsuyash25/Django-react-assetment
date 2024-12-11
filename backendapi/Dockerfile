
FROM python:3.9
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# The enviroment variable ensures that the python output is set straight
# to the terminal with out buffering it first
ENV PYTHONUNBUFFERED 1

# Set the working directory to /music_service
WORKDIR /app/backendapi

COPY requirements.txt /app/backendapi/

COPY entrypoint.sh /app/backendapi/entrypoint.sh

RUN cp /app/backendapi/entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/entrypoint.sh

COPY . /app/backendapi/

RUN pip3 install --upgrade pip setuptools wheel

RUN pip install -r requirements.txt





