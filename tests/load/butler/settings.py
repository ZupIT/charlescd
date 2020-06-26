
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.realpath(__file__)), '.env'))

CD_CONFIGURATION_ID = os.getenv("CD_CONFIGURATION_ID")
AUTHOR_ID = os.getenv("AUTHOR_ID")
HOST = os.getenv("HOST")

