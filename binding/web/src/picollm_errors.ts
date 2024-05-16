//
// Copyright 2024 Picovoice Inc.
//
// You may not use this file except in compliance with the license. A copy of the license is located in the "LICENSE"
// file accompanying this source.
//
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
// an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.
//

import { PvError } from "@picovoice/web-utils";
import { PvStatus } from "./types";

class PicoLLMError extends Error {
  private readonly _status: PvStatus;
  private readonly _shortMessage: string;
  private readonly _messageStack: string[];

  constructor(status: PvStatus, message: string, messageStack: string[] = [], pvError: PvError | null = null) {
    super(PicoLLMError.errorToString(message, messageStack, pvError));
    this._status = status;
    this.name = 'PicoLLMError';
    this._shortMessage = message;
    this._messageStack = messageStack;
  }

  get status(): PvStatus {
    return this._status;
  }

  get shortMessage(): string {
    return this._shortMessage;
  }

  get messageStack(): string[] {
    return this._messageStack;
  }

  private static errorToString(
    initial: string,
    messageStack: string[],
    pvError: PvError | null = null,
  ): string {
    let msg = initial;

    if (pvError) {
      const pvErrorMessage = pvError.getErrorString();
      if (pvErrorMessage.length > 0) {
        msg += `\nDetails: ${pvErrorMessage}`;
      }
    }

    if (messageStack.length > 0) {
      msg += `: ${messageStack.reduce((acc, value, index) =>
        acc + '\n  [' + index + '] ' + value, '')}`;
    }

    return msg;
  }
}

class PicoLLMOutOfMemoryError extends PicoLLMError {
  constructor(message: string, messageStack?: string[], pvError: PvError | null = null) {
    super(PvStatus.OUT_OF_MEMORY, message, messageStack, pvError);
    this.name = 'PicoLLMOutOfMemoryError';
  }
}

class PicoLLMIOError extends PicoLLMError {
  constructor(message: string, messageStack: string[] = [], pvError: PvError | null = null) {
    super(PvStatus.IO_ERROR, message, messageStack, pvError);
    this.name = 'PicoLLMIOError';
  }
}

class PicoLLMInvalidArgumentError extends PicoLLMError {
  constructor(message: string, messageStack: string[] = [], pvError: PvError | null = null) {
    super(PvStatus.INVALID_ARGUMENT, message, messageStack, pvError);
    this.name = 'PicoLLMInvalidArgumentError';
  }
}

class PicoLLMStopIterationError extends PicoLLMError {
  constructor(message: string, messageStack: string[] = [], pvError: PvError | null = null) {
    super(PvStatus.STOP_ITERATION, message, messageStack, pvError);
    this.name = 'PicoLLMStopIterationError';
  }
}

class PicoLLMKeyError extends PicoLLMError {
  constructor(message: string, messageStack: string[] = [], pvError: PvError | null = null) {
    super(PvStatus.KEY_ERROR, message, messageStack, pvError);
    this.name = 'PicoLLMKeyError';
  }
}

class PicoLLMInvalidStateError extends PicoLLMError {
  constructor(message: string, messageStack: string[] = [], pvError: PvError | null = null) {
    super(PvStatus.INVALID_STATE, message, messageStack, pvError);
    this.name = 'PicoLLMInvalidStateError';
  }
}

class PicoLLMRuntimeError extends PicoLLMError {
  constructor(message: string, messageStack: string[] = [], pvError: PvError | null = null) {
    super(PvStatus.RUNTIME_ERROR, message, messageStack, pvError);
    this.name = 'PicoLLMRuntimeError';
  }
}

class PicoLLMActivationError extends PicoLLMError {
  constructor(message: string, messageStack: string[] = [], pvError: PvError | null = null) {
    super(PvStatus.ACTIVATION_ERROR, message, messageStack, pvError);
    this.name = 'PicoLLMActivationError';
  }
}

class PicoLLMActivationLimitReachedError extends PicoLLMError {
  constructor(message: string, messageStack: string[] = [], pvError: PvError | null = null) {
    super(PvStatus.ACTIVATION_LIMIT_REACHED, message, messageStack, pvError);
    this.name = 'PicoLLMActivationLimitReachedError';
  }
}

class PicoLLMActivationThrottledError extends PicoLLMError {
  constructor(message: string, messageStack: string[] = [], pvError: PvError | null = null) {
    super(PvStatus.ACTIVATION_THROTTLED, message, messageStack, pvError);
    this.name = 'PicoLLMActivationThrottledError';
  }
}

class PicoLLMActivationRefusedError extends PicoLLMError {
  constructor(message: string, messageStack: string[] = [], pvError: PvError | null = null) {
    super(PvStatus.ACTIVATION_REFUSED, message, messageStack, pvError);
    this.name = 'PicoLLMActivationRefusedError';
  }
}

export {
  PicoLLMError,
  PicoLLMOutOfMemoryError,
  PicoLLMIOError,
  PicoLLMInvalidArgumentError,
  PicoLLMStopIterationError,
  PicoLLMKeyError,
  PicoLLMInvalidStateError,
  PicoLLMRuntimeError,
  PicoLLMActivationError,
  PicoLLMActivationLimitReachedError,
  PicoLLMActivationThrottledError,
  PicoLLMActivationRefusedError,
};


export function pvStatusToException(
  pvStatus: PvStatus,
  errorMessage: string,
  messageStack: string[] = [],
  pvError: PvError | null = null
): PicoLLMError {
  switch (pvStatus) {
    case PvStatus.OUT_OF_MEMORY:
      return new PicoLLMOutOfMemoryError(errorMessage, messageStack, pvError);
    case PvStatus.IO_ERROR:
      return new PicoLLMIOError(errorMessage, messageStack, pvError);
    case PvStatus.INVALID_ARGUMENT:
      return new PicoLLMInvalidArgumentError(errorMessage, messageStack, pvError);
    case PvStatus.STOP_ITERATION:
      return new PicoLLMStopIterationError(errorMessage, messageStack, pvError);
    case PvStatus.KEY_ERROR:
      return new PicoLLMKeyError(errorMessage, messageStack, pvError);
    case PvStatus.INVALID_STATE:
      return new PicoLLMInvalidStateError(errorMessage, messageStack, pvError);
    case PvStatus.RUNTIME_ERROR:
      return new PicoLLMRuntimeError(errorMessage, messageStack, pvError);
    case PvStatus.ACTIVATION_ERROR:
      return new PicoLLMActivationError(errorMessage, messageStack, pvError);
    case PvStatus.ACTIVATION_LIMIT_REACHED:
      return new PicoLLMActivationLimitReachedError(errorMessage, messageStack, pvError);
    case PvStatus.ACTIVATION_THROTTLED:
      return new PicoLLMActivationThrottledError(errorMessage, messageStack, pvError);
    case PvStatus.ACTIVATION_REFUSED:
      return new PicoLLMActivationRefusedError(errorMessage, messageStack, pvError);
    default:
      // eslint-disable-next-line no-console
      console.warn(`Unmapped error code: ${pvStatus}`);
      return new PicoLLMError(pvStatus, errorMessage);
  }
}
