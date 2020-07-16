import { useContext } from 'react';
import { BILoggerContext } from './BILoggerProvider';

const useBILogger = () => useContext(BILoggerContext)!;

export default useBILogger;
