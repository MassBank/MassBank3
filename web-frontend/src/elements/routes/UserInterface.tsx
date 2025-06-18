import './UserInterface.scss';

import { Content } from 'antd/es/layout/layout';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { Layout } from 'antd';
import Modal from 'antd/es/modal/Modal';

const headerHeight = 60;
const footerHeight = 50;

type InputProps = {
  body: JSX.Element;
};

function UserInterface({ body }: InputProps) {
  const [showDataPrivacyModal, setShowDataPrivacyModal] =
    useState<boolean>(false);
  const [dataPrivacyContainer, setDataPrivacyContainer] =
    useState<JSX.Element | null>(null);

  useEffect(() => {
    const container = document.getElementById('data-privacy-container');
    if (container) {
      setDataPrivacyContainer(
        container.innerHTML ? (
          <div dangerouslySetInnerHTML={{ __html: container.innerHTML }} />
        ) : null,
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (window.showDataPrivacyModal === true) {
        setShowDataPrivacyModal(true);
      }
    }
  }, []);

  const handleOnClickDataPrivacy = useCallback(() => {
    setShowDataPrivacyModal(true);
  }, []);

  return useMemo(
    () => (
      <Layout className="user-interface">
        <Header height={headerHeight} />
        <Content
          style={{
            width: '100%',
            height: `calc(100% - ${headerHeight} - ${footerHeight})`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {body}
        </Content>
        <Footer
          height={footerHeight}
          enableDataPrivacyButton={dataPrivacyContainer !== null}
          onClickDataPrivacy={handleOnClickDataPrivacy}
        />
        <Modal
          open={showDataPrivacyModal}
          onCancel={() => setShowDataPrivacyModal(false)}
          width="100%"
          style={{ top: 20 }}
          title="Data Privacy Information"
          cancelButtonProps={{ style: { display: 'none' } }}
          onOk={() => setShowDataPrivacyModal(false)}
        >
          <Content
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {dataPrivacyContainer ? (
              dataPrivacyContainer
            ) : (
              <div style={{ textAlign: 'center' }}>
                No data privacy information available.
              </div>
            )}
          </Content>
        </Modal>
      </Layout>
    ),
    [
      body,
      dataPrivacyContainer,
      handleOnClickDataPrivacy,
      showDataPrivacyModal,
    ],
  );
}

export default UserInterface;
