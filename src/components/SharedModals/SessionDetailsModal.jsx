import { useGetSingleSessionSlotsQuery } from '@/redux/api/sessionApi';
import { Modal } from 'antd';
import Image from 'next/image';
import { RiCloseLargeLine } from 'react-icons/ri';

const SessionDetailsModal = ({ open, setOpen, session }) => {
  const id = session?.id;

  // Get sessionSlot API handler
  const { data, isError, isLoading } = useGetSingleSessionSlotsQuery(id);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div></div>;

  // Grouping sessions by date
  const groupedSessions = data?.data?.reduce((acc, session) => {
    const sessionDate = session.date;
    if (!acc[sessionDate]) {
      acc[sessionDate] = [];
    }
    acc[sessionDate].push(session);
    return acc;
  }, {});

  return (
    <Modal
      open={open}
      footer={null}
      centered={true}
      onCancel={() => setOpen(false)}
      closeIcon={false}
      style={{
        minWidth: '900px',
        position: 'relative',
      }}
    >
      <div
        className="absolute right-0 top-0 h-12 w-12 cursor-pointer rounded-bl-3xl"
        onClick={() => setOpen(false)}
      >
        <RiCloseLargeLine size={18} color="black" className="absolute left-1/3 top-1/3" />
      </div>
      <div className="p-10">
        <div className="flex gap-10">
          <div className="flex-1">
            {/* Thumbnail Section */}
            <div className="w-full">
              <Image
                src={session?.thumbnail}
                alt="Session Thumbnail"
                width={400}
                height={300}
                className=" h-[200px] w-full object-cover"
              />
            </div>

            {/* Session Details Section */}
            <div className="w-full p-6 md:w-2/3">
              <h2 className="mb-2 text-2xl font-semibold">Session Details</h2>
              <h3 className="mb-4 text-lg text-gray-600">Find Balance & Clarity</h3>

              {/* About Therapy Section */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-600">About Therapy Session</h4>
                <p className="text-gray-800">{session?.des}</p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            {/* Time Slots */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600">Time Slots</h4>
              {/* Displaying grouped sessions by date */}
              {Object.keys(groupedSessions)?.map((date) => (
                <div key={date}>
                  <h2 className="font-bold">Sessions on {date}</h2>
                  <ul className="list-none space-y-2 text-gray-800">
                    {groupedSessions[date]?.map((session) => (
                      <li key={session._id}>
                        {session.startTime} - {session.endTime}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Location */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600">Location</h4>
              <p className="text-gray-800">{session?.location}</p>
            </div>

            {/* Per Session Fee */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600">Per Session Fee</h4>
              <p className="text-xl font-semibold text-gray-900">{session?.fee}</p>
            </div>

            {/* Therapy Type */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600">Therapy Type</h4>
              <p className="text-gray-800">{session?.therapyType}</p>
            </div>

            {/* Therapist Info */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600">Therapist</h4>
              <p className="text-gray-800">{session?.therapist}</p>
            </div>

            {/* About Therapist */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-600">About Therapist</h4>
              <p className="text-gray-800">{session?.bio}</p>
            </div>

            {/* Therapist Certificates */}
            <div>
              <h4 className="text-sm font-semibold text-gray-600">Therapist Certificates</h4>
              <p>{session?.achievement}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SessionDetailsModal;
