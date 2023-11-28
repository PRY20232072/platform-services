import logging

def configure_logging(verbose=False):
    log_format = '%(asctime)s - %(levelname)s - %(message)s'
    level = logging.DEBUG if verbose else logging.INFO

    logging.basicConfig(level=level, format=log_format)