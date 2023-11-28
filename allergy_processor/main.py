import sys
import argparse
import logging

from sawtooth_sdk.processor.core import TransactionProcessor
from handler import AllergyTransactionHandler
from helpers import logging_config

logging_config.configure_logging()


def parse_args(args):
    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)

    parser.add_argument(
        '-C', '--connect',
        default='tcp://localhost:4004',
        help='Endpoint for the validator connection')

    parser.add_argument(
        '-v', '--verbose',
        action='count',
        default=0,
        help='Increase output sent to stderr')

    return parser.parse_args(args)


def main(args=None):
    if args is None:
        args = sys.argv[1:]
    opts = parse_args(args)

    processor = None

    try:
        processor = TransactionProcessor(url=opts.connect)

        logging.info(
            "Connecting to Sawtooth validator at {}".format(opts.connect))

        handler = AllergyTransactionHandler()

        processor.add_handler(handler)
        processor.start()
    except KeyboardInterrupt:
        pass
    except Exception as e:  # pylint: disable=broad-except, invalid-name
        logging.error(e)
    finally:
        if processor is not None:
            processor.stop()


if __name__ == '__main__':
    main()
